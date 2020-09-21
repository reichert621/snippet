import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/ChatWidget';

const noop = () => {};
const w = window as any;
const config = (w.Papercups && w.Papercups.config) || {};
const {
  accountId,
  title,
  subtitle,
  newMessagePlaceholder,
  primaryColor,
  greeting,
  customer,
  baseUrl,
  iframeUrlOverride,
  customIconUrl,
  agentAvailableText,
  agentUnavailableText,
  showAgentAvailability,
  requireEmailUpfront = false,
  defaultIsOpen = false,
  onChatOpened = noop,
  onChatClosed = noop,
  onMessageSent = noop,
  onMessageReceived = noop,
} = config;

if (!accountId) {
  throw new Error(
    'An account token is required to render the Papercups chat widget!'
  );
}

const el = document.createElement('div');
el.id = 'PapercupsChatWidget';
document.body.appendChild(el);

ReactDOM.render(
  <ChatWidget
    accountId={accountId}
    title={title}
    subtitle={subtitle}
    newMessagePlaceholder={newMessagePlaceholder}
    primaryColor={primaryColor}
    greeting={greeting}
    customer={customer}
    baseUrl={baseUrl}
    iframeUrlOverride={iframeUrlOverride}
    customIconUrl={customIconUrl}
    agentAvailableText={agentAvailableText}
    agentUnavailableText={agentUnavailableText}
    showAgentAvailability={showAgentAvailability}
    requireEmailUpfront={requireEmailUpfront}
    defaultIsOpen={defaultIsOpen}
    onChatOpened={onChatOpened}
    onChatClosed={onChatClosed}
    onMessageSent={onMessageSent}
    onMessageReceived={onMessageReceived}
  />,
  document.getElementById('PapercupsChatWidget')
);
