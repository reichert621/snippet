import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';

// TODO: there's probably a more elegant way to do this...

const noop = () => {};
const w = window as any;
const config = (w.Papercups && w.Papercups.config) || {};
const {
  token,
  inbox,
  accountId,
  title,
  subtitle,
  newMessagePlaceholder,
  emailInputPlaceholder,
  newMessagesNotificationText,
  primaryColor,
  greeting,
  awayMessage,
  customer,
  baseUrl,
  iframeUrlOverride,
  customIconUrl,
  agentAvailableText,
  agentUnavailableText,
  showAgentAvailability,
  iconVariant = 'outlined',
  hideToggleButton = false,
  requireEmailUpfront = false,
  defaultIsOpen = false,
  isOpenByDefault = false,
  persistOpenState = false,
  hideOutsideWorkingHours = false,
  popUpInitialMessage = false,
  disableAnalyticsTracking = false,
  debug = false,
  position = 'right',
  styles = {},
  onChatLoaded = noop,
  onChatOpened = noop,
  onChatClosed = noop,
  onMessageSent = noop,
  onMessageReceived = noop,
} = config;

const t = token || accountId;

if (!t) {
  throw new Error(
    'An account token is required to render the Papercups chat widget!'
  );
}

const el = document.createElement('div');
el.id = 'PapercupsChatWidget';
document.body.appendChild(el);

ReactDOM.render(
  <ChatWidget
    token={token}
    inbox={inbox}
    accountId={accountId}
    title={title}
    subtitle={subtitle}
    newMessagePlaceholder={newMessagePlaceholder}
    emailInputPlaceholder={emailInputPlaceholder}
    newMessagesNotificationText={newMessagesNotificationText}
    primaryColor={primaryColor}
    greeting={greeting}
    awayMessage={awayMessage}
    customer={customer}
    baseUrl={baseUrl}
    iframeUrlOverride={iframeUrlOverride}
    customIconUrl={customIconUrl}
    agentAvailableText={agentAvailableText}
    agentUnavailableText={agentUnavailableText}
    showAgentAvailability={showAgentAvailability}
    requireEmailUpfront={requireEmailUpfront}
    defaultIsOpen={defaultIsOpen}
    isOpenByDefault={isOpenByDefault}
    persistOpenState={persistOpenState}
    iconVariant={iconVariant}
    hideToggleButton={hideToggleButton}
    hideOutsideWorkingHours={hideOutsideWorkingHours}
    popUpInitialMessage={popUpInitialMessage}
    styles={styles}
    position={position}
    debug={debug}
    disableAnalyticsTracking={disableAnalyticsTracking}
    onChatLoaded={onChatLoaded}
    onChatOpened={onChatOpened}
    onChatClosed={onChatClosed}
    onMessageSent={onMessageSent}
    onMessageReceived={onMessageReceived}
  />,
  document.getElementById('PapercupsChatWidget')
);
