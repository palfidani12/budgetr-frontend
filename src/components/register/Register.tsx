import { useState } from 'react';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import '../login/Login.css';

export const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    // Mock registration delay
    setTimeout(() => {
      setLoading(false);
      if (email === 'demo@budgetr.com') {
        setError('This email is already registered.');
      } else {
        setSuccess('Registration successful! You can now log in.');
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      }
    }, 1200);
  };

  return (
    <div className='login-container'>
      <form
        className='login-form'
        onSubmit={handleSubmit}
      >
        <h2 className='login-title'>Create your Budgetr account</h2>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            id='name'
            type='text'
            autoComplete='name'
            placeholder='Your name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='email'>Email</label>
          <input
            id='email'
            type='email'
            autoComplete='username'
            placeholder='you@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <div className='password-input-wrapper'>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='Create a password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='show-password-toggle'
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className='form-group'>
          <label htmlFor='confirmPassword'>Confirm Password</label>
          <input
            id='confirmPassword'
            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            placeholder='Repeat your password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className='login-error'>{error}</div>}
        {success && <div className='login-success'>{success}</div>}
        <button
          className='login-submit'
          type='submit'
          disabled={loading}
        >
          {loading ? (
            'Registering...'
          ) : (
            <>
              <UserPlus size={18} /> Register
            </>
          )}
        </button>
      </form>
    </div>
  );
};
