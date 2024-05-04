import boto3

region_name = 'us-east-1'

endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
# endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'

client = boto3.client(
    'mturk',
    endpoint_url=endpoint_url,
    region_name=region_name,
)

qual_response = client.create_qualification_type(
                        Name='Fish segmentation qualification',
                        Keywords='qualification, fish, segmentation',
                        Description='This is a brief test to qualify you to work on fish segmentation assignments.',
                        QualificationTypeStatus='Active',
                        Test=open("qualification.xml").read(),
                        AnswerKey=open("qualification-answers.xml").read(),
                        RetryDelayInSeconds=3600,
                        TestDurationInSeconds=1800)

qid = qual_response['QualificationType']['QualificationTypeId']
print("https://workersandbox.mturk.com/qualifications/" + qid)
