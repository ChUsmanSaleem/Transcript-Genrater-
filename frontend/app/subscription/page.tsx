'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, CreditCard, CheckCircle, X, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import stripePromise from '../../src/utils/stripe';
import { createSubscription, getSubscriptionStatus, cancelSubscription } from '../../src/utils/api';
import ConfirmationModal from '../components/subscription/ConfirmationModal';

const SubscriptionForm = ({ onSuccess, onRefresh }: { onSuccess: () => void; onRefresh: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Create payment method
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: formData.name,
          email: formData.email,
        },
      });

      if (error) {
        toast.error(error.message || 'Payment method creation failed');
        setLoading(false);
        return;
      }

      // Call backend to create subscription
      const response = await createSubscription(paymentMethod.id);

      if (response.error) {
        toast.error(response.error);
        setLoading(false);
        return;
      }

      toast.success('Subscription created successfully!');
      onRefresh(); // Refresh status
      onSuccess();
    } catch (err) {
      toast.error('An error occurred during subscription creation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Plan Benefits</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Generate unlimited transcripts</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Access to all premium features</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Priority support</span>
          </div>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400"
            placeholder="Enter your email"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Card Details</label>
          <div className="p-3 border border-gray-600 rounded-lg bg-gray-700">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#ffffff',
                    '::placeholder': {
                      color: '#9ca3af',
                    },
                  },
                },
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading || !stripe}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Subscribe Now - $20/month
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default function SubscriptionPage() {
  const router = useRouter();
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCustomExpires, setShowCustomExpires] = useState(false);
  const [customExpires, setCustomExpires] = useState<Date | null>(null);

  useEffect(() => {
    loadSubscriptionStatus();
  }, []);

  const loadSubscriptionStatus = async () => {
    try {
      const statusRes = await getSubscriptionStatus();
      setSubscriptionStatus(statusRes);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setCancelLoading(true);
    try {
      const response = await cancelSubscription();
      if (response.error) {
        toast.error(response.error);
      } else {
        toast.success('Subscription will be canceled at the end of the current period.');
        loadSubscriptionStatus(); // Refresh status
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  const handleSubscriptionSuccess = () => {
    loadSubscriptionStatus(); // Refresh status after successful subscription
    // Set custom expires date to current date + 1 month
    const now = new Date();
    const expires = new Date(now);
    expires.setMonth(expires.getMonth() + 1);
    setCustomExpires(expires);
    setShowCustomExpires(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const isSubscribed = subscriptionStatus?.is_active;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Active Subscription Section */}
            {isSubscribed && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-8 h-8 text-yellow-500" />
                  <h2 className="text-2xl font-semibold">Premium Plan</h2>
                  <div className="flex items-center gap-2">
                    {subscriptionStatus?.status === 'active' ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      subscriptionStatus?.status === 'active'
                        ? 'bg-green-600 text-white'
                        : 'bg-red-600 text-white'
                    }`}>
                      {subscriptionStatus?.status === 'active' ? 'Active' : 'Canceled'}
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                    <p className="text-gray-300">Premium Plan - $20/month</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Started on</h3>
                    <p className="text-gray-300">
                      {subscriptionStatus?.current_period_start
                        ? new Date(subscriptionStatus.current_period_start).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Expires on</h3>
                    <p className="text-gray-300">
                      {showCustomExpires && customExpires
                        ? customExpires.toLocaleDateString()
                        : subscriptionStatus?.current_period_end
                        ? new Date(subscriptionStatus.current_period_end).toLocaleDateString()
                        : 'N/A'
                      }
                    </p>
                  </div>

                  {subscriptionStatus?.canceled_at && (
                    <div>
                      <h3 className="text-lg font-medium mb-2">Canceled on</h3>
                      <p className="text-gray-300">
                        {new Date(subscriptionStatus.canceled_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Plan Benefits</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Generate unlimited transcripts</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Access to all premium features</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={cancelLoading}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition flex items-center gap-2"
                  >
                    {cancelLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Canceling...
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4" />
                        Cancel Subscription
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Inactive Subscription Section */}
            {!isSubscribed && (
              <div className="bg-gray-800 p-6 rounded-lg">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-semibold mb-2">No Active Subscription</h2>
                  <p className="text-gray-300">Subscribe to access premium features and generate unlimited transcripts.</p>
                  {subscriptionStatus?.status === 'canceled' && (
                    <p className="text-yellow-400 text-sm mt-2">
                      Your previous subscription has expired. You can now subscribe again.
                    </p>
                  )}
                </div>
                <Elements stripe={stripePromise}>
                  <SubscriptionForm onSuccess={handleSubscriptionSuccess} onRefresh={loadSubscriptionStatus} />
                </Elements>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={handleCancelSubscription}
        title="Cancel Subscription"
        message="Are you sure you want to cancel your subscription? It will remain active until the end of the current billing period."
        confirmText="Yes, Cancel"
        cancelText="No, Keep Subscription"
      />
    </div>
  );
}
