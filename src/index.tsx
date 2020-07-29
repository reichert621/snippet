import React from 'react';
import ReactDOM from 'react-dom';
import ChatWidget from './components/EmbeddableWidget';

const w = window as any;
const config = (w.Papercups && w.Papercups.config) || {};
const {
  accountId,
  title,
  subtitle,
  primaryColor,
  greeting,
  customer,
  baseUrl,
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
    primaryColor={primaryColor}
    greeting={greeting}
    customer={customer}
    baseUrl={baseUrl}
  />,
  document.getElementById('PapercupsChatWidget')
);
