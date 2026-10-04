import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
  onSuccess?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onSwitchToRegister, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.j@stockpulse.io');
  const [password, setPassword] = useState('WarehousePass2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('manager');
  const [btnState, setBtnState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [biometricScanning, setBiometricScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const applyRolePreset = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('alex.admin@stockpulse.io');
    } else if (role === 'manager') {
      setEmail('sarah.j@stockpulse.io');
    } else {
      setEmail('marcus.dock@stockpulse.io');
    }
    setPassword('WarehousePass2025!');
    setErrorMessage(null);
  };

  const handleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setBtnState('loading');

    try {
      await login(email, password);
      setBtnState('success');
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 700);
    } catch (err: any) {
      setBtnState('idle');
      setErrorMessage(err?.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  const triggerBiometric = async () => {
    setBiometricScanning(true);
    setErrorMessage(null);

    setTimeout(async () => {
      try {
        await login(email, password);
        setBiometricScanning(false);
        setBtnState('success');
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 700);
      } catch (err) {
        setBiometricScanning(false);
      }
    }, 1000);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center relative w-full bg-[#f8fafc] min-h-screen px-4 py-8">
      <div className="flex flex-col w-full max-w-md mx-auto">
        {/* Brand & Mascot Area */}
        <div className="flex flex-col items-center pt-2 pb-4 text-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-3xl bg-indigo-600 shadow-md shadow-indigo-200 mb-3.5 transition-transform hover:scale-105">
            <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              inventory_2
            </span>
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          </div>

          <div className="flex items-center gap-2 justify-center mb-1">
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Stock<span className="text-indigo-600">Pulse</span>
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-semibold">
              v4.2
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-xs font-medium">
            Next-Gen Warehouse & Stock Control
          </p>
        </div>

        {/* Security Protocol Chip */}
        <div className="flex items-center justify-center gap-2 py-1.5 px-3.5 rounded-full bg-slate-100/90 border border-slate-200/70 text-slate-600 mb-5 mx-auto shadow-sm">
          <span className="material-symbols-outlined text-emerald-600 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            verified_user
          </span>
          <span className="text-xs font-semibold tracking-wide uppercase">Enterprise Encrypted SSO</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
        </div>

        {/* Main Login Card */}
        <div className="flex flex-col w-full bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100/80">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Welcome Back</h2>
              <p className="text-xs text-slate-500 mt-0.5">Sign in to your station</p>
            </div>
            {/* Ambient Live Hub Indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/60 text-slate-600 shadow-sm">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100"></span>
              <span className="text-xs font-medium">WH-East 04</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-rose-600 text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleSignIn} className="flex flex-col gap-4">
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700" htmlFor="workEmail">
                Work Email
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-xl">alternate_email</span>
                </div>
                <input
                  id="workEmail"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah.j@stockpulse.io"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-slate-900 text-sm font-medium placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700" htmlFor="userPassword">
                  Security PIN / Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Demo vault credentials active. You can sign in directly or switch roles!')}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </div>
                <input
                  id="userPassword"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-11 pr-11 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-slate-900 text-sm font-medium tracking-wider placeholder-slate-400 outline-none transition-all focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-600 active:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Facility Station Selector */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 text-slate-600">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="material-symbols-outlined text-lg text-indigo-600 shrink-0">barcode_scanner</span>
                <span className="text-xs font-medium text-slate-600 truncate">
                  Scanner Peripheral: <strong className="text-slate-800 font-semibold">Zebra TC57 (Paired)</strong>
                </span>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100 shrink-0"></span>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={btnState === 'loading'}
              className={`w-full h-12 mt-1 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-200 active:scale-[0.99] transition-all cursor-pointer ${
                btnState === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {btnState === 'loading' ? (
                <>
                  <span className="material-symbols-outlined text-xl animate-spin">sync</span>
                  <span>Authenticating Warehouse Node...</span>
                </>
              ) : btnState === 'success' ? (
                <>
                  <span className="material-symbols-outlined text-xl">check_circle</span>
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-xl">login</span>
                  <span>Sign In to Dashboard</span>
                </>
              )}
            </button>

            {/* Biometric Instant Sign In Option */}
            <div className="relative flex py-1 items-center justify-center">
              <div className="flex-grow h-px bg-slate-200/80"></div>
              <span className="shrink mx-3 text-slate-400 text-[11px] font-semibold tracking-wider uppercase">
                or instant verify
              </span>
              <div className="flex-grow h-px bg-slate-200/80"></div>
            </div>

            <button
              type="button"
              onClick={triggerBiometric}
              disabled={biometricScanning}
              className="w-full h-11 rounded-2xl bg-slate-100/90 hover:bg-slate-100 border border-slate-200/60 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 active:bg-slate-200/80 transition-colors cursor-pointer"
            >
              <span
                className={`material-symbols-outlined text-xl text-indigo-600 ${
                  biometricScanning ? 'animate-pulse' : ''
                }`}
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                fingerprint
              </span>
              <span>
                {biometricScanning ? 'Scanning Sensor...' : 'Tap for Fingerprint / Passkey'}
              </span>
            </button>
          </form>
        </div>

        {/* Role Preset Rapid Selector */}
        <div className="flex flex-col gap-2 mt-5">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              RAPID SWITCH TESTING
            </span>
            <span className="text-xs font-semibold text-indigo-600">Demo Vault</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Admin Role */}
            <button
              type="button"
              onClick={() => applyRolePreset('admin')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white border text-slate-800 shadow-sm active:bg-slate-100 transition-all cursor-pointer ${
                selectedRole === 'admin'
                  ? 'border-indigo-400 ring-1 ring-indigo-500/20'
                  : 'border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                <span className="text-xs font-bold text-slate-800">Admin</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">Full Vault</span>
            </button>

            {/* Manager Role */}
            <button
              type="button"
              onClick={() => applyRolePreset('manager')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white border text-slate-800 shadow-sm active:bg-slate-100 transition-all cursor-pointer ${
                selectedRole === 'manager'
                  ? 'border-indigo-400 ring-1 ring-indigo-500/20'
                  : 'border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span className="text-xs font-bold text-slate-800">Manager</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">Logistics</span>
            </button>

            {/* Staff Role */}
            <button
              type="button"
              onClick={() => applyRolePreset('staff')}
              className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white border text-slate-800 shadow-sm active:bg-slate-100 transition-all cursor-pointer ${
                selectedRole === 'staff'
                  ? 'border-indigo-400 ring-1 ring-indigo-500/20'
                  : 'border-slate-200/70 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-bold text-slate-800">Staff</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-0.5 font-medium">Floor Scan</span>
            </button>
          </div>
        </div>

        {/* Bottom Visual Micro-Bento Card */}
        <div className="mt-4 rounded-3xl bg-white border border-slate-200/70 p-3.5 flex items-center gap-3.5 shadow-sm">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100/70 flex items-center justify-center shrink-0 text-indigo-600">
            <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 truncate">High-Bay Scanner Active</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              Sign in to sync your active pick-list and route
            </p>
          </div>
        </div>

        {/* Registration Callout */}
        <div className="flex flex-col items-center justify-center text-center mt-6 gap-1">
          <p className="text-xs text-slate-500">Don't have an organization account?</p>
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
          >
            <span>Register facility or request access</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>

        {/* Micro Footer Compliance Notice */}
        <div className="flex items-center justify-center gap-3 mt-4 text-center">
          <span className="text-[11px] text-slate-400 font-medium">SOC2 Certified</span>
          <span className="text-[11px] text-slate-300">•</span>
          <span className="text-[11px] text-slate-400 font-medium">FedRAMP In-Process</span>
          <span className="text-[11px] text-slate-300">•</span>
          <span className="text-[11px] text-slate-400 font-medium">Privacy</span>
        </div>
      </div>
    </main>
  );
};
