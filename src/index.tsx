import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';

// TODO: there's probably a more elegant way to do this...

(function (w: any) {
  const noop = () => {};
  const config = (w.Papercups && w.Papercups.config) || {};
  const el = document.createElement('div');
  el.id = 'PapercupsChatWidget';
  document.body.appendChild(el);

  const init = (overrides = {}) => {
    const params = {...config, ...overrides};
    const {
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
      popUpInitialMessage = false,
      position = 'right',
      styles = {},
      onChatLoaded = noop,
      onChatOpened = noop,
      onChatClosed = noop,
      onMessageSent = noop,
      onMessageReceived = noop,
    } = params;

    if (!accountId) {
      throw new Error(
        'An account token is required to render the Papercups chat widget!'
      );
    }

    ReactDOM.render(
      <ChatWidget
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
        popUpInitialMessage={popUpInitialMessage}
        iconVariant={iconVariant}
        hideToggleButton={hideToggleButton}
        styles={styles}
        position={position}
        onChatLoaded={onChatLoaded}
        onChatOpened={onChatOpened}
        onChatClosed={onChatClosed}
        onMessageSent={onMessageSent}
        onMessageReceived={onMessageReceived}
      />,
      document.getElementById('PapercupsChatWidget')
    );
  };

  w.Papercups.init = init;
  w.Papercups.init();
})(window);
