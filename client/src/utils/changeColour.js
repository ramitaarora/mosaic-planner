export default function changeColour(theme) {
    const rootEl = document.querySelector(':root');

    if (theme === 'dark') {
      rootEl.style.setProperty('--text', '#000f08');
      rootEl.style.setProperty('--background', '#1c3738');
      rootEl.style.setProperty('--card-background', '#8baaad');
      rootEl.style.setProperty('--line-background', '#f4fff8');
    }
    if (theme === 'light') {
      rootEl.style.setProperty('--text', '#395C6B');
      rootEl.style.setProperty('--background', '#B8CCF5');
      rootEl.style.setProperty('--card-background', '#DDE9F8');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'blue') {
      rootEl.style.setProperty('--text', '#001B2E');
      rootEl.style.setProperty('--background', '#294C60');
      rootEl.style.setProperty('--card-background', '#BFCFE8');
      rootEl.style.setProperty('--line-background', '#FDF9F1');
    }
    if (theme === 'purple') {
      rootEl.style.setProperty('--text', '#2C1320');
      rootEl.style.setProperty('--background', '#5F4B66');
      rootEl.style.setProperty('--card-background', '#AC8EB6');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'forest') {
      rootEl.style.setProperty('--text', '#3B322C');
      rootEl.style.setProperty('--background', '#3B322C');
      rootEl.style.setProperty('--card-background', '#5E8C61');
      rootEl.style.setProperty('--line-background', '#EBF6EF');
    }
    if (theme === 'misty') {
      rootEl.style.setProperty('--text', '#061826');
      rootEl.style.setProperty('--background', '#3685B5');
      rootEl.style.setProperty('--card-background', '#89AAE6');
      rootEl.style.setProperty('--line-background', '#E7DAE3');
    }
    if (theme === 'classy') {
      rootEl.style.setProperty('--text', '#424242');
      rootEl.style.setProperty('--background', '#424242');
      rootEl.style.setProperty('--card-background', '#A3A3A3');
      rootEl.style.setProperty('--line-background', '#FEFFEA');
    }
    if (theme === 'saffron') {
      rootEl.style.setProperty('--text', '#264653');
      rootEl.style.setProperty('--background', '#2A9D8F');
      rootEl.style.setProperty('--card-background', '#E9C46A');
      rootEl.style.setProperty('--line-background', '#FDF4EC');
    }
    if (theme === 'pink') {
      rootEl.style.setProperty('--text', '#565857');
      rootEl.style.setProperty('--background', '#734B5E');
      rootEl.style.setProperty('--card-background', '#D7C1CB');
      rootEl.style.setProperty('--line-background', '#FFFFFF');
    }
    if (theme === 'gold') {
      rootEl.style.setProperty('--text', '#7A4419');
      rootEl.style.setProperty('--background', '#400406');
      rootEl.style.setProperty('--card-background', '#B9953C');
      rootEl.style.setProperty('--line-background', '#EBEDE8');
    }
    if (theme === 'halloween') {
      rootEl.style.setProperty('--text', '#331F00');
      rootEl.style.setProperty('--background', '#331F00');
      rootEl.style.setProperty('--card-background', '#A46303');
      rootEl.style.setProperty('--line-background', '#FDF5D0');
    }
    if (theme === 'spring') {
      rootEl.style.setProperty('--text', '#140000');
      rootEl.style.setProperty('--background', '#7CB69A');
      rootEl.style.setProperty('--card-background', '#F3C9C9');
      rootEl.style.setProperty('--line-background', '#FFFDF2');
    }
    if (theme === 'ocean') {
      rootEl.style.setProperty('--text', '#1E3D5F');
      rootEl.style.setProperty('--background', '#4A6E95');
      rootEl.style.setProperty('--card-background', '#ADC1D7');
      rootEl.style.setProperty('--line-background', '#EEF5FC');
    }
    if (theme === 'love') {
      rootEl.style.setProperty('--text', '#4E0312');
      rootEl.style.setProperty('--background', '#C66C80');
      rootEl.style.setProperty('--card-background', '#E5BBB3');
      rootEl.style.setProperty('--line-background', '#F9F3F0');
    }
    if (theme === 'desert') {
      rootEl.style.setProperty('--text', '#311a0c');
      rootEl.style.setProperty('--background', '#834521');
      rootEl.style.setProperty('--card-background', '#EBC999');
      rootEl.style.setProperty('--line-background', '#F9F7F0');
    }
  }