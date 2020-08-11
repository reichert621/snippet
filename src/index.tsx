import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/EmbeddableWidget';

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
  requireEmailUpfront = false,
  defaultIsOpen = false,
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
    requireEmailUpfront={requireEmailUpfront}
    defaultIsOpen={defaultIsOpen}
  />,
  document.getElementById('PapercupsChatWidget')
);
