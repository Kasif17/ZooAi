import { ArrowLeft, Check, Crown, Sparkles, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { createPayment, verifyPayment } from '../features/payment';

const plans = [
  {
    key: 'free',
    name: 'Free',
    description: 'For trying out ZooAi.',
    price: '₹0',
    period: '/month',
    credits: '100 AI credits',
    icon: Zap,
    features: ['100 AI credits', 'AI code generation', 'Project editor', 'HTML / CSS / JS preview', 'React preview', 'Basic project management'],
    button: 'Current Plan',
    current: true,
  },
  {
    key: 'pro',
    name: 'Pro',
    description: 'For developers who build regularly.',
    price: '₹299',
    period: '/month',
    credits: '500 AI credits',
    icon: Sparkles,
    popular: true,
    features: ['500 AI credits', 'Everything in Free', 'Priority AI generation', 'Larger projects', 'Unlimited projects', 'Advanced AI coding', 'Priority support'],
    button: 'Upgrade to Pro',
  },
  {
    key: 'team',
    name: 'Team',
    description: 'For teams building products together.',
    price: '₹799',
    period: '/month',
    credits: '2,000 AI credits',
    icon: Crown,
    features: ['2,000 AI credits', 'Everything in Pro', 'Team collaboration', 'Shared projects', 'Higher AI limits', 'Priority processing', 'Team support'],
    button: 'Upgrade to Team',
  },
];

function Plan() {
  const navigate = useNavigate();

  const handlePayment = async (plan) => {
    try {
      if (plan.key === 'free' || plan.current) return;
      const data = await createPayment(plan.key);
      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency || 'INR',
        name: 'ZooAi',
        description: `Plan ${plan.name}`,
        order_id: data.order.id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = response;
          await verifyPayment({ razorpay_order_id, razorpay_payment_id, razorpay_signature });
        },
        theme: { color: '#4f6ef7' },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen px-5 py-8" style={{ background: 'var(--zoo-bg)', color: 'var(--zoo-text)' }}>
      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, rgba(79,110,247,0.4) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-5xl">
        {/* Nav */}
        <div className="mb-10 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-medium transition-colors"
            style={{ background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text-2)' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--zoo-text)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--zoo-text-2)'}
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="flex items-center gap-2">
            <img src="/ZooAi.png" alt="ZooAi" className="h-6 w-6 rounded object-contain" />
            <span className="text-[14px] font-bold" style={{ color: 'var(--zoo-text)' }}>
              Zoo<span className="zoo-gradient-text">Ai</span>
            </span>
          </div>
        </div>

        {/* Hero */}
        <div className="mx-auto mb-12 max-w-xl text-center">
          <div
            className="mx-auto mb-4 flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-[12px] font-medium"
            style={{ background: 'rgba(79,110,247,0.1)', borderColor: 'rgba(79,110,247,0.25)', color: '#7c9bff' }}
          >
            <Sparkles size={12} />
            Simple pricing for developers
          </div>
          <h1 className="text-[36px] font-bold tracking-tight sm:text-[44px]" style={{ color: 'var(--zoo-text)' }}>
            Build more.{' '}
            <span className="zoo-gradient-text">Ship faster.</span>
          </h1>
          <p className="mt-4 text-[14px] leading-relaxed" style={{ color: 'var(--zoo-text-2)' }}>
            Choose a plan that gives you the AI credits you need to build and iterate faster.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-5 md:grid-cols-3">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="relative flex flex-col rounded-2xl border p-6 transition-all"
                style={plan.popular
                  ? {
                      background: 'var(--zoo-surface)',
                      borderColor: 'rgba(79,110,247,0.4)',
                      boxShadow: '0 0 0 1px rgba(79,110,247,0.15), 0 16px 48px rgba(79,110,247,0.12)',
                    }
                  : { background: 'var(--zoo-surface)', borderColor: 'var(--zoo-border)' }
                }
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"
                    style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c5cfc)' }}
                  >
                    Most Popular
                  </div>
                )}

                {/* Icon */}
                <div
                  className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={plan.popular
                    ? { background: 'rgba(79,110,247,0.15)', color: '#7c9bff' }
                    : { background: 'var(--zoo-surface-2)', color: 'var(--zoo-text-2)' }
                  }
                >
                  <Icon size={16} />
                </div>

                <h2 className="text-[17px] font-bold" style={{ color: 'var(--zoo-text)' }}>{plan.name}</h2>
                <p className="mt-1 min-h-[36px] text-[12px] leading-relaxed" style={{ color: 'var(--zoo-text-2)' }}>
                  {plan.description}
                </p>

                <div className="mt-4 flex items-end gap-1">
                  <span className="text-[30px] font-bold tracking-tight" style={{ color: 'var(--zoo-text)' }}>{plan.price}</span>
                  <span className="mb-1 text-[12px]" style={{ color: 'var(--zoo-text-3)' }}>{plan.period}</span>
                </div>

                {/* Credits badge */}
                <div
                  className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2.5 text-[12px] font-semibold"
                  style={{ background: 'var(--zoo-surface-2)', borderColor: 'var(--zoo-border)', color: 'var(--zoo-text)' }}
                >
                  <Zap size={13} style={{ color: '#7c9bff' }} fill="#7c9bff" />
                  {plan.credits}
                </div>

                {/* CTA */}
                <button
                  onClick={() => handlePayment(plan)}
                  className="mt-5 w-full rounded-xl py-2.5 text-[13px] font-semibold transition-all"
                  style={plan.current
                    ? { background: 'var(--zoo-surface-2)', color: 'var(--zoo-text-3)', cursor: 'default' }
                    : plan.popular
                      ? { background: 'linear-gradient(135deg, #4f6ef7, #6a52f5)', color: '#fff', boxShadow: '0 4px 16px rgba(79,110,247,0.3)' }
                      : { background: 'var(--zoo-surface-2)', color: 'var(--zoo-text)', border: '1px solid var(--zoo-border)' }
                  }
                  onMouseEnter={e => { if (!plan.current && !plan.popular) e.currentTarget.style.borderColor = 'rgba(79,110,247,0.4)'; }}
                  onMouseLeave={e => { if (!plan.current && !plan.popular) e.currentTarget.style.borderColor = 'var(--zoo-border)'; }}
                >
                  {plan.button}
                </button>

                {/* Features */}
                <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--zoo-border)' }}>
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--zoo-text-3)' }}>
                    Includes
                  </p>
                  <ul className="space-y-2.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-[12.5px]" style={{ color: 'var(--zoo-text-2)' }}>
                        <Check size={13} className="mt-0.5 shrink-0" style={{ color: '#34d399' }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-[11px]" style={{ color: 'var(--zoo-text-3)' }}>
          Credits reset every month. Unused credits do not roll over.
        </p>
      </div>
    </div>
  );
}

export default Plan;
