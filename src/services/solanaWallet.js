/**
 * פונקציה פשוטה לחיבור וקבלת חתימה גולמית מארנק פאנטום
 * @returns {Promise<{success: boolean, walletAddress: string | null, message: string | null, signature: Uint8Array | null, error: string | null}>}
 */
export const loginWithPhantom = async () => {
  try {
    // בדיקה אם פאנטום זמין
    if (!("solana" in window) || !window.solana.isPhantom) {
      return {
        success: false,
        walletAddress: null,
        message: null,
        signature: null,
        error: "Phantom wallet not installed"
      };
    }

    const provider = window.solana;

    // התחברות לארנק אם עוד לא מחובר
    if (!provider.isConnected) {
      try {
        await provider.connect();
      } catch (connectError) {
        return {
          success: false,
          walletAddress: null,
          message: null,
          signature: null,
          error: connectError.message || "User rejected wallet connection"
        };
      }
    }

    // בדיקה שאכן התחברנו וקיבלנו מפתח ציבורי
    if (!provider.isConnected || !provider.publicKey) {
      return {
        success: false,
        walletAddress: null,
        message: null,
        signature: null,
        error: "Failed to connect to wallet"
      };
    }

    const walletAddress = provider.publicKey.toString();

    // יצירת הודעה לחתימה
    const message = `Login to App: ${new Date().toISOString()}`;
    const encodedMessage = new TextEncoder().encode(message);

    // קבלת חתימה
    try {
      const signResult = await provider.signMessage(encodedMessage, "utf8");
      
      // החזרת החתימה הגולמית כפי שהיא מגיעה מפאנטום
      return {
        success: true,
        walletAddress,
        message,
        signature: signResult.signature,
        error: null
      };
    } catch (signError) {
      return {
        success: false,
        walletAddress,
        message: null,
        signature: null,
        error: signError.message || "User rejected signing"
      };
    }
  } catch (error) {
    return {
      success: false,
      walletAddress: null,
      message: null,
      signature: null,
      error: error.message || "Unknown error occurred"
    };
  }
};

export default loginWithPhantom;