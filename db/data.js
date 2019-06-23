module.exports = {
  issues: [{ type: 'data' }, { type: 'config' }],
  notifications: [
    {
      issue_type_id: 1,
      title: 'Something Bad Happened',
      body:
        'This is a message that describes the issue in more detail. Click here to view'
    },
    {
      issue_type_id: 2,
      title: 'Something Else Bad Happened',
      body:
        'This is a message that describes the issue in more detail. Click here to view'
    }
  ]
};
