import boto3


# endpoint_url = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
endpoint_url = 'https://mturk-requester.us-east-1.amazonaws.com'

qualifier = '3DVPGYXANKRT4J2W1JVQFIND2NSVLH' # sandbox
# qualifier = '3ZK7SK3NC597HL0QKZY6NF1NVFA124' # live


qualifier_lvl_2 = '3UZ6VZ89OTWY9DQPLBCKVV8XRBXGBE' # live

client = boto3.client(
    'mturk',
    endpoint_url=endpoint_url,
    region_name='us-east-1',
)

question = open('external-question.xml',mode='r').read()
new_hit = client.create_hit_type(
    Title = 'Rate the quality of background removal of a fish image',
    Description = 'Assess the quality of five images of fish which have had the backgrounds removed through automated methods.',
    Keywords = 'fish,image,segmentation,background',
    Reward = '0.05',
    AssignmentDurationInSeconds = 600,
    AutoApprovalDelayInSeconds = 432000,
    QualificationRequirements=[
        {'QualificationTypeId':qualifier_lvl_2,
         'Comparator': 'EqualTo',
         'IntegerValues':[100]},
        {'QualificationTypeId':'00000000000000000040',
         'Comparator': 'GreaterThan',
         'IntegerValues':[100]},
        {'QualificationTypeId':'000000000000000000L0',
         'Comparator': 'GreaterThan',
         'IntegerValues':[90]},
        {'QualificationTypeId':"00000000000000000071",
         'Comparator':"In",
         'LocaleValues':[{'Country':"US"},{'Country':"CA"},{'Country':"GB"},{'Country':"AU"},{'Country':"NZ"}]}]
)

print(new_hit)
