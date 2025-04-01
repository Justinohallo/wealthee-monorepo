/**
 * Utility functions for password management
 */

/**
 * Generates a temporary password for new users
 * @param length Length of the password to generate (default: 12)
 * @returns A temporary password string
 */
export function generateTemporaryPassword(length = 12): string {
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerChars = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const specialChars = "!@#$%^&*()_+{}[]";
    const allChars = upperChars + lowerChars + numbers + specialChars;

    // Ensure at least one of each character type
    let password =
        upperChars.charAt(Math.floor(Math.random() * upperChars.length)) +
        lowerChars.charAt(Math.floor(Math.random() * lowerChars.length)) +
        numbers.charAt(Math.floor(Math.random() * numbers.length)) +
        specialChars.charAt(Math.floor(Math.random() * specialChars.length));

    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
        password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }

    // Shuffle the password using Fisher-Yates algorithm
    const passwordArray = password.split("");
    for (let i = passwordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
    }

    return passwordArray.join("");
}
