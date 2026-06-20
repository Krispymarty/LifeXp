export default function Card({ children, className = '' }) {
  return (
    <section className={`rounded-lg border border-purple-100/80 bg-white p-5 shadow-[0_12px_34px_rgba(69,31,123,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-purple-200 hover:shadow-[0_18px_44px_rgba(69,31,123,0.14)] ${className}`}>
      {children}
    </section>
  );
}
