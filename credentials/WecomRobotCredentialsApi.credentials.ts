import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class WecomRobotCredentialsApi implements ICredentialType {
	name = 'wecomRobotCredentialsApi';
	displayName = 'Wecom Robot Credentials API';
	// @ts-ignore
	icon = 'file:icon.png';
	properties: INodeProperties[] = [
		{
			displayName: 'Token',
			name: 'token',
			// eslint-disable-next-line n8n-nodes-base/cred-class-field-type-options-password-missing
			type: 'string',
			default: '',
			required: true,
		},
		{
			displayName: 'AesKey',
			description: '加密的AesKey，参考：https://developer.work.weixin.qq.com/document/path/101039',
			name: 'aesKey',
			// eslint-disable-next-line n8n-nodes-base/cred-class-field-type-options-password-missing
			type: 'string',
			default: '',
			required: true,
		},
	];
}
