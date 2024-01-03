
import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';
function getPassword(value) {
    if (value) {
        return Base64.stringify(sha256(value))
    }
}
export default getPassword