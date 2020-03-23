var university_data = [{
  value: '1',
  label: '华南师范大学',
  level: 1,
  campus: [
    {
      value: '1',
      label: '石牌校区',
      level: 2
    },
    {
      value: '1',
      label: '大学城校区',
      level: 2
    },
    {
      value: '1',
      label: '南海校区',
      level: 2
    }
  ]
},
  {
    value: '2',
    label: '华南理工大学',
    level: 1,
    campus: [
      {
        value: '2',
        label: '五山校区',
        level: 2
      },
      {
        value: '2',
        label: '大学城校区',
        level: 2
      },
      {
        value: '1',
        label: '南海校区',
        level: 2
      }
    ]
  }];

function getUniversity() {
  return university_data;
}

module.exports.getUniversity = getUniversity