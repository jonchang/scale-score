import boto3

live_data = {
    'endpoint_url': 'https://mturk-requester.us-east-1.amazonaws.com',
    'hit_type': '3TNRXJHW8K9I7SWZ2BBOCHR6UGSC21'
}

live_data_lvl_2 = {
    'endpoint_url': 'https://mturk-requester.us-east-1.amazonaws.com',
    'hit_type': '33KTOXRB2LV6EOXU83GQLVKH3L3FRX'
}

sandbox_data = {
    'endpoint_url': 'https://mturk-requester-sandbox.us-east-1.amazonaws.com',
    'hit_type': '3DY668G4EOVY56JAMRX2YD162DFXEW'
}

data = live_data_lvl_2

client = boto3.client(
    'mturk',
    endpoint_url=data['endpoint_url'],
    region_name='us-east-1',
)

NUM_HITS = 500


question = open('external-question.xml',mode='r').read()
print("HITGroupId\tHITTypeId\tHITId")
for idx in range(NUM_HITS):
    new_hit = client.create_hit_with_hit_type(MaxAssignments=1, HITTypeId=data['hit_type'], LifetimeInSeconds=3600, Question=question)
    hh = new_hit['HIT']
    print(hh['HITGroupId'] + "\t" + hh['HITTypeId'] + "\t" + hh['HITId'])
