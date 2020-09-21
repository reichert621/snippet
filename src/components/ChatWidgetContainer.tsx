/** @jsx jsx */

import React from 'react';
import {ThemeProvider, jsx} from 'theme-ui';
import qs from 'query-string';
import {
  CustomerMetadata,
  Message,
  WidgetSettings,
  fetchWidgetSettings,
  updateWidgetSettingsMetadata,
} from '../api';
import {WidgetConfig, noop} from '../utils';
import getThemeConfig from '../theme';
import store from '../storage';
import {isDev} from '../config';
import Logger from '../logger';
import {getUserInfo} from '../track/info';

const DEFAULT_IFRAME_URL = 'https://chat-widget.papercups.io';

// TODO: set this up somewhere else
const setup = (w: any, handlers: (msg?: any) => void) => {
  const cb = (msg: any) => {
    handlers(msg);
  };

  if (w.addEventListener) {
    w.addEventListener('message', cb);

    return () => w.removeEventListener('message', cb);
  } else {
    w.attachEvent('onmessage', cb);

    return () => w.detachEvent('message', cb);
  }
};

// TODO: DRY up props with ChatWidget component
type Props = {
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  accountId: string;
  baseUrl?: string;
  greeting?: string;
  customer?: CustomerMetadata | null;
  newMessagePlaceholder?: string;
  agentAvailableText?: string;
  agentUnavailableText?: string;
  showAgentAvailability?: boolean;
  iframeUrlOverride?: string;
  requireEmailUpfront?: boolean;
  defaultIsOpen?: boolean;
  customIconUrl?: string;
  onChatOpened?: () => void;
  onChatClosed?: () => void;
  onMessageSent?: (message: Message) => void;
  onMessageReceived?: (message: Message) => void;
  children: (data: any) => any;
};

type State = {
  isOpen: boolean;
  isLoaded: boolean;
  query: string;
  config: WidgetConfig;
  shouldDisplayNotifications: boolean;
  isTransitioning: boolean;
};

class ChatWidgetContainer extends React.Component<Props, State> {
  iframeRef: any;
  storage: any;
  unsubscribe: any;
  logger: Logger;

  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      isLoaded: false,
      query: '',
      config: {} as WidgetConfig,
      shouldDisplayNotifications: false,
      isTransitioning: false,
    };
  }

  async componentDidMount() {
    const settings = await this.fetchWidgetSettings();
    const {
      accountId,
      title,
      subtitle,
      primaryColor,
      baseUrl,
      greeting,
      newMessagePlaceholder,
      agentAvailableText,
      agentUnavailableText,
      showAgentAvailability,
      requireEmailUpfront,
      customer = {},
    } = this.props;
    // TODO: make it possible to opt into debug mode via props
    const debugModeEnabled = isDev(window);

    this.logger = new Logger(debugModeEnabled);
    this.unsubscribe = setup(window, this.handlers);
    this.storage = store(window);

    const metadata = {...getUserInfo(window), ...customer};
    const config: WidgetConfig = {
      accountId,
      baseUrl,
      agentAvailableText,
      agentUnavailableText,
      title: title || settings.title,
      subtitle: subtitle || settings.subtitle,
      primaryColor: primaryColor || settings.color,
      greeting: greeting || settings.greeting,
      newMessagePlaceholder:
        newMessagePlaceholder || settings.new_message_placeholder,
      companyName: settings?.account?.company_name,
      requireEmailUpfront: requireEmailUpfront ? 1 : 0,
      showAgentAvailability: showAgentAvailability ? 1 : 0,
      customerId: this.storage.getCustomerId(),
      metadata: JSON.stringify(metadata),
    };

    const query = qs.stringify(config, {skipEmptyString: true, skipNull: true});

    this.setState({config, query});

    // Set some metadata on the widget to better understand usage
    await this.updateWidgetSettingsMetadata();
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  componentDidUpdate(prevProps: Props) {
    const {
      accountId,
      title,
      subtitle,
      primaryColor,
      baseUrl,
      greeting,
      newMessagePlaceholder,
    } = this.props;
    const current = [
      accountId,
      title,
      subtitle,
      primaryColor,
      baseUrl,
      greeting,
      newMessagePlaceholder,
    ];
    const prev = [
      prevProps.accountId,
      prevProps.title,
      prevProps.subtitle,
      prevProps.primaryColor,
      prevProps.baseUrl,
      prevProps.greeting,
      prevProps.newMessagePlaceholder,
    ];
    const shouldUpdate = current.some((value, idx) => {
      return value !== prev[idx];
    });

    // Send updates to iframe if props change. (This is mainly for use in
    // the demo and "Getting Started" page, where users can play around with
    // customizing the chat widget to suit their needs)
    if (shouldUpdate) {
      this.handleConfigUpdated({
        accountId,
        title,
        subtitle,
        primaryColor,
        baseUrl,
        greeting,
        newMessagePlaceholder,
      });
    }
  }

  setIframeRef = (el: HTMLIFrameElement) => {
    this.iframeRef = el;
  };

  getIframeUrl = () => {
    return this.props.iframeUrlOverride || DEFAULT_IFRAME_URL;
  };

  handleConfigUpdated = (updates: WidgetConfig) => {
    this.setState({
      config: {
        ...this.state.config,
        ...updates,
      },
    });

    this.send('config:update', updates);
  };

  fetchWidgetSettings = () => {
    const {accountId, baseUrl} = this.props;
    const empty = {} as WidgetSettings;

    return fetchWidgetSettings(accountId, baseUrl)
      .then((settings) => settings || empty)
      .catch(() => empty);
  };

  updateWidgetSettingsMetadata = () => {
    const {accountId, baseUrl} = this.props;
    const metadata = getUserInfo(window);

    return updateWidgetSettingsMetadata(accountId, metadata, baseUrl).catch(
      (err) => {
        // No need to block on this
        this.logger.error('Failed to update widget metadata:', err);
      }
    );
  };

  handlers = (msg: any) => {
    this.logger.debug('Handling in parent:', msg.data);
    const iframeUrl = this.getIframeUrl();
    const {origin} = new URL(iframeUrl);

    if (msg.origin !== origin) {
      return null;
    }

    const {event, payload = {}} = msg.data;

    switch (event) {
      case 'chat:loaded':
        return this.handleChatLoaded();
      case 'customer:created':
      case 'customer:updated':
        return this.handleCacheCustomerId(payload);
      case 'conversation:join':
        return this.sendCustomerUpdate(payload);
      case 'message:received':
        return this.handleMessageReceived(payload);
      case 'message:sent':
        return this.handleMessageSent(payload);
      case 'messages:unseen':
        return this.handleUnseenMessages(payload);
      case 'messages:seen':
        return this.handleMessagesSeen();
      case 'papercups:open':
        return this.handleToggleOpen();
      default:
        return null;
    }
  };

  send = (event: string, payload?: any) => {
    this.logger.debug('Sending from parent:', {event, payload});
    const el = this.iframeRef as any;

    if (!el) {
      throw new Error(
        `Attempted to send event ${event} with payload ${JSON.stringify(
          payload
        )} before iframeRef was ready`
      );
    }

    el.contentWindow.postMessage({event, payload}, this.getIframeUrl());
  };

  handleMessageReceived = (message: Message) => {
    const {onMessageReceived = noop} = this.props;
    const {user_id: userId, customer_id: customerId} = message;
    const isFromAgent = !!userId && !customerId;

    // Only invoke callback if message is from agent, because we currently track
    // `message:received` events to know if a message went through successfully
    if (isFromAgent) {
      onMessageReceived && onMessageReceived(message);
    }
  };

  handleMessageSent = (message: Message) => {
    const {onMessageSent = noop} = this.props;

    onMessageSent && onMessageSent(message);
  };

  handleUnseenMessages = (payload: any) => {
    this.logger.debug('Handling unseen messages:', payload);

    this.setState({shouldDisplayNotifications: true});
    this.send('notifications:display', {shouldDisplayNotifications: true});
  };

  handleMessagesSeen = () => {
    this.logger.debug('Handling messages seen');

    this.setState({shouldDisplayNotifications: false});
    this.send('notifications:display', {shouldDisplayNotifications: false});
  };

  handleChatLoaded = () => {
    this.setState({isLoaded: true});

    if (this.props.defaultIsOpen) {
      this.setState({isOpen: true}, () => this.emitToggleEvent(true));
    }

    return this.send('papercups:ping'); // Just testing
  };

  formatCustomerMetadata = () => {
    const {customer = {}} = this.props;

    if (!customer) {
      return {};
    }

    return Object.keys(customer).reduce((acc, key) => {
      if (key === 'metadata') {
        return {...acc, [key]: customer[key]};
      } else {
        // Make sure all other passed-in values are strings
        return {...acc, [key]: String(customer[key])};
      }
    }, {});
  };

  sendCustomerUpdate = (payload: any) => {
    const {customerId} = payload;
    const customerBrowserInfo = getUserInfo(window);
    const metadata = {...customerBrowserInfo, ...this.formatCustomerMetadata()};

    return this.send('customer:update', {customerId, metadata});
  };

  handleCacheCustomerId = (payload: any) => {
    const {customerId} = payload;

    return this.storage.setCustomerId(customerId);
  };

  emitToggleEvent = (isOpen: boolean) => {
    this.send('papercups:toggle', {isOpen});

    const {onChatOpened = noop, onChatClosed = noop} = this.props;

    if (isOpen) {
      onChatOpened && onChatOpened();
    } else {
      onChatClosed && onChatClosed();
    }
  };

  handleToggleOpen = () => {
    const {isOpen: wasOpen, isLoaded, shouldDisplayNotifications} = this.state;
    const isOpen = !wasOpen;

    // Prevent opening the widget until everything has loaded
    if (!isLoaded) {
      return;
    }

    if (!wasOpen && shouldDisplayNotifications) {
      this.setState({isTransitioning: true}, () => {
        setTimeout(() => {
          this.setState({isOpen, isTransitioning: false}, () =>
            this.emitToggleEvent(isOpen)
          );
        }, 200);
      });
    } else {
      this.setState({isOpen}, () => this.emitToggleEvent(isOpen));
    }
  };

  render() {
    const {
      isOpen,
      isLoaded,
      query,
      config,
      shouldDisplayNotifications,
      isTransitioning,
    } = this.state;
    const {customIconUrl, children} = this.props;
    const {primaryColor} = config;

    if (!query) {
      return null;
    }

    const iframeUrl = this.getIframeUrl();
    const isActive = (isOpen || shouldDisplayNotifications) && !isTransitioning;
    const theme = getThemeConfig({primary: primaryColor});
    const sandbox = [
      // Allow scripts to load in iframe
      'allow-scripts',
      // Allow opening links from iframe
      'allow-popups',
      // Needed to access localStorage
      'allow-same-origin',
      // Allow form for message input
      'allow-forms',
    ].join(' ');

    return (
      <ThemeProvider theme={theme}>
        {children({
          sandbox,
          isLoaded,
          isActive,
          isOpen,
          isTransitioning,
          customIconUrl,
          iframeUrl,
          query,
          shouldDisplayNotifications,
          setIframeRef: this.setIframeRef,
          onToggleOpen: this.handleToggleOpen,
        })}
      </ThemeProvider>
    );
  }
}

export default ChatWidgetContainer;
