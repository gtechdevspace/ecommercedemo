import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

const endpoint = process.env.AWS_ENDPOINT;
export const sns = new SNSClient({ region: process.env.AWS_REGION || 'us-east-1', endpoint });

export async function publishInventoryEvent(topicArn: string, payload: any) {
  const cmd = new PublishCommand({ TopicArn: topicArn, Message: JSON.stringify(payload) });
  await sns.send(cmd);
}
