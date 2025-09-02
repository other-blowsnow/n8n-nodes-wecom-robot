import { IExecuteFunctions } from 'n8n-workflow';
import crypto from 'crypto';

class RequestUtils {
	/**
	 * 获取图片base64
	 * @param url
	 */
	static async getImageBase64(this: IExecuteFunctions, url: string): Promise<string> {
		const response: any = await this.helpers.httpRequest({
			url: url,
			returnFullResponse: true,
			encoding: 'arraybuffer'
		});

		return (response.body as Buffer).toString('base64');
	}

	static getImageMd5(base64Data: string) {
		// 转换为 Buffer
		const buffer = Buffer.from(base64Data, "base64");

		// 计算 MD5
		return crypto.createHash('md5').update(buffer).digest('hex');
	}
}


export default RequestUtils;
