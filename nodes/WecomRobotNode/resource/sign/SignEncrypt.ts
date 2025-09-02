import { IDataObject, IExecuteFunctions } from 'n8n-workflow';
import { ResourceOperations } from '../../../help/type/IResource';
import WecomRobotUtils from '../../../help/utils/WecomRobotUtils';

export default {
	name: '消息加密',
	value: 'sign:encrypt',
	options: [
		{
			displayName: '*加密数据',
			name: 'data',
			default: '',
			type: 'json',
			required: true,
		},
		{
			displayName: '*Webhook返回的Nonce',
			name: 'nonce',
			default: '',
			type: 'string',
			required: true,
		},
	],
	async call(this: IExecuteFunctions, index: number): Promise<IDataObject> {
		const data = this.getNodeParameter('data', index) as IDataObject;
		const nonce = this.getNodeParameter('nonce', index) as string;
		const timestamp = parseInt(Date.now() / 1000 + '');

		const credential = await this.getCredentials('wecomRobotCredentialsApi');
		const aesKey = credential.aesKey as string;
		const token = credential.token as string;

		// 生成16位长的随机字符串 7bfa1b71134f023a  1756823252831000
		const random = '7bfa1b71134f023a';
		const encryptMsg = WecomRobotUtils.encrypt(aesKey, JSON.stringify(data), nonce, random);

		return {
			encrypt: encryptMsg,
			msgsignature: WecomRobotUtils.getSignature(token, timestamp, nonce, encryptMsg),
			timestamp: timestamp,
			nonce: nonce,
		};
	},
} as ResourceOperations;
