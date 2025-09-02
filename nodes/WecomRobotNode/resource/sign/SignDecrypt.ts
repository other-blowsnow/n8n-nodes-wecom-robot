import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import WecomRobotUtils from '../../../help/utils/WecomRobotUtils';

export default {
	name: '消息解密',
	value: 'sign:decrypt',
	options: [
		{
			displayName: '*解密数据',
			name: 'data',
			default: '',
			type: 'string',
			required: true,
		},
		{
			displayName: '*Webhook返回的nonce',
			name: 'nonce',
			default: '',
			type: 'string',
			required: true,
		},
		{
			displayName: '*Webhook返回的timestamp',
			name: 'timestamp',
			default: '',
			type: 'string',
			required: true,
		},
		{
			displayName: '*Webhook返回的signature',
			name: 'signature',
			default: '',
			type: 'string',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const credential = await this.getCredentials('wecomRobotCredentialsApi');
		const aesKey = credential.aesKey as string;
		const token = credential.token as string;

		const encrypt = this.getNodeParameter('data', index) as string;
		const timestamp = this.getNodeParameter('timestamp', index) as number;
		const nonce = this.getNodeParameter('nonce', index) as string;
		const signature = this.getNodeParameter('signature', index) as string;

		const verifySignature = WecomRobotUtils.getSignature(token, timestamp, nonce, encrypt);
		if (signature !== verifySignature) {
			throw new Error('签名验证失败');
		}

		return WecomRobotUtils.decrypt(aesKey, encrypt);
	},
} as ResourceOperations;
