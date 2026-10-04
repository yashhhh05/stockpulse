import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
  onSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onSwitchToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('Sarah Jenkins');
  const [email, setEmail] = useState('sarah.j@stockpulse.io');
  const [password, setPassword] = useState('WarehousePass2025!');
  const [confirmPassword, setConfirmPassword] = useState('WarehousePass2025!');
  const [warehouseId, setWarehouseId] = useState('Warehouse Central Bay-04');
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [agreed, setAgreed] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreed) {
      setError('Please agree to terms and warehouse policies.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await register({
        name: fullName,
        email,
        password,
        role: selectedRole,
        facility: warehouseId
      });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col relative w-full bg-[#f8fafc] min-h-screen pb-12">
      <div className="flex flex-col w-full max-w-lg mx-auto">
        {/* Top bar with back button & StockPulse ID badge */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-100 shadow-sm">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors active:scale-95 text-slate-800 border border-slate-200/60 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warehouse
            </span>
            <span className="text-xs uppercase tracking-wider text-indigo-700 font-semibold">
              StockPulse ID
            </span>
          </div>
        </div>

        <div className="px-6 pt-5 pb-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h1>
            <p className="text-sm text-slate-500">Join your warehouse operations team</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Primary Credentials Card */}
            <div className="flex flex-col gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800" htmlFor="reg-fullname">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400">
                    badge
                  </span>
                  <input
                    id="reg-fullname"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Work Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800" htmlFor="reg-email">
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400">
                    alternate_email
                  </span>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-12 pl-11 pr-4 bg-slate-50 rounded-2xl border border-slate-200/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Secure Password */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-800" htmlFor="reg-password">
                    Secure Password
                  </label>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Strong
                  </span>
                </div>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400">
                    lock
                  </span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-11 bg-slate-50 rounded-2xl border border-slate-200/60 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {/* 4 strength indicators */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  <div className="h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="h-1.5 rounded-full bg-emerald-500"></div>
                  <div className="h-1.5 rounded-full bg-emerald-500"></div>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800" htmlFor="reg-confirm-password">
                  Confirm Password
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400">
                    verified_user
                  </span>
                  <input
                    id="reg-confirm-password"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-12 pl-11 pr-11 bg-slate-50 rounded-2xl border border-slate-200/60 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3.5 text-[20px] text-emerald-600">
                    check_circle
                  </span>
                </div>
              </div>

              {/* Warehouse / Department ID */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-800" htmlFor="reg-warehouse">
                  Warehouse / Department ID
                </label>
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-slate-400">
                    hub
                  </span>
                  <input
                    id="reg-warehouse"
                    type="text"
                    value={warehouseId}
                    onChange={(e) => setWarehouseId(e.target.value)}
                    placeholder="e.g. WH-B4-SEC2"
                    className="w-full h-12 pl-11 pr-11 bg-slate-50 rounded-2xl border border-slate-200/60 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    title="Scan Facility Code"
                    className="absolute right-3.5 text-indigo-600 flex items-center justify-center p-1 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Role Selection Cards */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900">Select Operational Role</label>
                <span className="text-xs text-slate-500 font-medium">Requires Approval</span>
              </div>

              <div className="flex flex-col gap-3">
                {/* Admin Card */}
                <label
                  onClick={() => setSelectedRole('admin')}
                  className={`relative flex flex-col p-4 rounded-2xl cursor-pointer shadow-sm transition-all ${
                    selectedRole === 'admin'
                      ? 'bg-indigo-50/70 border-2 border-indigo-600'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          shield_person
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Admin</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60 text-xs font-semibold">
                            System Tier
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Full access: User management, system settings, financial reports
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="user_role"
                      value="admin"
                      checked={selectedRole === 'admin'}
                      onChange={() => setSelectedRole('admin')}
                      className="mt-1 w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                  </div>
                </label>

                {/* Manager Card */}
                <label
                  onClick={() => setSelectedRole('manager')}
                  className={`relative flex flex-col p-4 rounded-2xl cursor-pointer shadow-sm transition-all ${
                    selectedRole === 'manager'
                      ? 'bg-indigo-50/70 border-2 border-indigo-600'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shrink-0">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          manage_accounts
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Manager</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/70 text-xs font-semibold">
                            Operations
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-0.5">
                          Inventory control, supplier management, stock approvals, reports
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="user_role"
                      value="manager"
                      checked={selectedRole === 'manager'}
                      onChange={() => setSelectedRole('manager')}
                      className="mt-1 w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                  </div>
                </label>

                {/* Staff Card */}
                <label
                  onClick={() => setSelectedRole('staff')}
                  className={`relative flex flex-col p-4 rounded-2xl cursor-pointer shadow-sm transition-all ${
                    selectedRole === 'staff'
                      ? 'bg-indigo-50/70 border-2 border-indigo-600'
                      : 'bg-white border border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                        <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                          inventory_2
                        </span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900">Staff</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
                            Floor Active
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Barcode scanning, stock in/out logging, real-time pick/pack
                        </p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="user_role"
                      value="staff"
                      checked={selectedRole === 'staff'}
                      onChange={() => setSelectedRole('staff')}
                      className="mt-1 w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                  </div>
                </label>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="privacy-terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-5 h-5 rounded-lg text-indigo-600 accent-indigo-600 border-slate-300 focus:ring-indigo-600 cursor-pointer"
                />
              </div>
              <label htmlFor="privacy-terms" className="text-xs text-slate-600 leading-normal cursor-pointer select-none">
                I confirm warehouse authorization and agree to the{' '}
                <span className="text-indigo-600 font-semibold">Terms of Service</span>, Facility Rules, and{' '}
                <span className="text-indigo-600 font-semibold">Data Privacy Policy</span>.
              </label>
            </div>

            {/* Submit & Login Link */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[50px] py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-semibold shadow-md shadow-indigo-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Registering Node...' : 'Create Account & Request Approval'}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 py-1">
                <span className="text-xs text-slate-500">Already registered?</span>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                >
                  Log in
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};
