export function decodeJwt(token: string) {
    const base64Url = token.split('.')[1]; // Get the payload part
   const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/'); // Convert Base64Url to standard Base64
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const token = "YOUR_JWT_TOKEN_HERE"; // Replace with your actual JWT token
const decoded = decodeJwt(token);

console.log(decoded);