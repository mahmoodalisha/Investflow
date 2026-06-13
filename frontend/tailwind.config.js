/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#0F172A',
        action: '#2563EB',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        canvas: '#F8FAFC',
        borderTint: '#E5E7EB',
        primaryText: '#111827',
        secondaryText: '#6B7280',
        mutedText: '#9CA3AF',
      },
      spacing: {
        'sidebar': '260px',
        'navbar': '70px',
      },
      borderRadius: {
        'card': '16px',
      },
      boxShadow: {
        'card': '0px 4px 12px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}