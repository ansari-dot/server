const otpStore = new Map();

export const setOTP = (email, otp) => {
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { otp, expiresAt });
};

export const verifyOTP = (email, otp) => {
    const data = otpStore.get(email);
    if (!data) return false;
    if (Date.now() > data.expiresAt) return false;
    return data.otp === otp;
};

export const removeOTP = (email) => otpStore.delete(email);