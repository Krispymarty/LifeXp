export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      colors: {
        xp: {
          bg: '#150B2E',
          panel: '#241244',
          purple: '#8F35FF',
          violet: '#B86BFF',
          gold: '#F8C84A',
          mint: '#4FE0B6',
          coral: '#FF7A85'
        }
      },
      boxShadow: {
        glow: '0 18px 50px rgba(143, 53, 255, 0.28)'
      }
    }
  },
  plugins: []
};
