import crypto from 'crypto';

class WecomRobotUtils {
	/**
	 * 解码并校验 encodingAESKey
	 *
	 * @param encodingAESKey EncodingAESKey
	 */
	static parseEncodingAESKey(encodingAESKey: string) {
		const key = Buffer.from(`${encodingAESKey}=`, 'base64');
		/* istanbul ignore if */
		if (key.length !== 32) {
			throw new Error('invalid encodingAESKey');
		}
		const iv = key.slice(0, 16);
		return { key, iv };
	}

	static pkcs7Pad(data: Buffer) {
		const padLength = 32 - (data.length % 32);
		const result = Buffer.allocUnsafe(padLength);
		result.fill(padLength);
		return Buffer.concat([data, result]);
	}

	static pkcs7Unpad(data: Buffer) {
		const padLength = data[data.length - 1];
		/* istanbul ignore if */
		if (padLength < 1 || padLength > 32) {
			return data;
		}
		return data.slice(0, data.length - padLength);
	}

	/**
	 *
	 * @param encodingAESKey
	 * @param message
	 * @param receiveid
	 * @param random 16个字节的随机字符串
	 */
	static encrypt(encodingAESKey: string, message: string, receiveid: string, random: string) {
		const { key, iv } = this.parseEncodingAESKey(encodingAESKey);
		const msg = Buffer.from(message);
		const msgLength = Buffer.allocUnsafe(4);
		msgLength.writeUInt32BE(msg.length, 0);
		const deciphered = this.pkcs7Pad(
			Buffer.concat([Buffer.from(random), msgLength, msg, Buffer.from(receiveid)]),
		);
		const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
		cipher.setAutoPadding(false);
		const ciphered = Buffer.concat([cipher.update(deciphered), cipher.final()]);
		// 返回加密数据的base64编码
		return ciphered.toString('base64');
	}

	static decrypt(encodingAESKey: string, encrypt: string) {
		const { key, iv } = this.parseEncodingAESKey(encodingAESKey);
		const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
		decipher.setAutoPadding(false);
		const deciphered = this.pkcs7Unpad(
			Buffer.concat([decipher.update(encrypt, 'base64'), decipher.final()]),
		);
		// 结构: 16字节随机 + 4字节msg_len + msg + receiveId
		const random = deciphered.slice(0, 16).toString('utf8');
		const msgLen = deciphered.slice(16, 20).readUInt32BE(0);
		const msg = deciphered.slice(20, 20 + msgLen).toString('utf8');
		const receiveId = deciphered.slice(20 + msgLen).toString('utf8');
		return {
			origin: deciphered.toString('utf8'),
			msg,
			receiveId,
			random,
		};
	}

	static getSignature(token: string, timestamp: number, nonce: string, encrypt: string) {
		return crypto
			.createHash('sha1')
			.update([token, timestamp, nonce, encrypt].sort().join(''))
			.digest('hex');
	}
}

export default WecomRobotUtils;
