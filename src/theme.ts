import tinycolor from 'tinycolor2';

type ThemeSettings = {primary?: string};

export const getThemeConfig = (settings: ThemeSettings) => {
  const {primary = '#1890ff'} = settings;
  const base = tinycolor(primary);
  const overrides = {
    primary: base.toString(),
    light: base.lighten().toString(),
    dark: base.darken().toString(),
  };

  return {
    useBodyStyles: false,
    space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
    fonts: {
      body:
        '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;',
      heading:
        '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sans-serif;',
      monospace: '"Roboto Mono", monospace',
    },
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
    fontWeights: {
      body: 400,
      heading: 600,
      bold: 600,
    },
    lineHeights: {
      body: 1.5,
      heading: 1.125,
    },
    colors: {
      text: '#141414',
      background: '#fff',
      primary: overrides.primary,
      secondary: '#722ed1',
      muted: '#f0f0f0',
      gray: 'rgba(0, 0, 0, 0.45)',
      // TODO: come up with better names!
      input: 'rgba(0, 0, 0, 0.65)',
      offset: 'rgba(255, 255, 255, 0.8)',
    },
    text: {
      default: {
        color: 'text',
        fontSize: 1,
      },
      caps: {
        textTransform: 'uppercase',
        letterSpacing: '0.2em',
      },
      heading: {
        fontFamily: 'heading',
        fontWeight: 'heading',
        lineHeight: 'heading',
      },
    },
    buttons: {
      primary: {
        cursor: 'pointer',
        outline: 0,
        transition: '0.2s',
        '&:hover': {
          background: overrides.light,
          borderColor: overrides.light,
        },
        '&:active': {
          background: overrides.dark,
          borderColor: overrides.dark,
        },
      },
    },
    styles: {
      root: {
        fontFamily: 'body',
        lineHeight: 'body',
        fontWeight: 'body',
        fontSize: 1,
      },
      h1: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 5,
      },
      h2: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 4,
      },
      h3: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 3,
      },
      h4: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 2,
      },
      h5: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 1,
      },
      h6: {
        color: 'text',
        fontFamily: 'heading',
        lineHeight: 'heading',
        fontWeight: 'heading',
        fontSize: 0,
      },
      p: {
        color: 'text',
        fontFamily: 'body',
        fontWeight: 'body',
        lineHeight: 'body',
      },
      a: {
        color: 'primary',
      },
      pre: {
        fontFamily: 'monospace',
        overflowX: 'auto',
        code: {
          color: 'inherit',
        },
      },
      code: {
        fontFamily: 'monospace',
        fontSize: 'inherit',
      },
      table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: 0,
      },
      th: {
        textAlign: 'left',
        borderBottomStyle: 'solid',
      },
      td: {
        textAlign: 'left',
        borderBottomStyle: 'solid',
      },
      img: {
        maxWidth: '100%',
      },
      textarea: {
        transparent: {
          border: 'none',
          boxShadow: 'none',
          resize: 'none',
          outline: 0,
          '&:hover': {
            border: 'none',
            boxShadow: 'none',
            resize: 'none',
            outline: 0,
          },
          '&:active': {
            border: 'none',
            boxShadow: 'none',
            resize: 'none',
            outline: 0,
          },
          '&:focus': {
            border: 'none',
            boxShadow: 'none',
            resize: 'none',
            outline: 0,
          },
        },
      },
      WidgetToggle: {
        outline: 'none',
        border: 'none',
        userSelect: 'none',
        cursor: 'pointer',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  };
};

export default getThemeConfig;
