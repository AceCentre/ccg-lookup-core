let data_dir = process.env.DATA_DIR
module.exports = {
  services: [
    {
      name: "AAC",
      table: data_dir + "/service-aac-ccg.csv",
      postcodes_lookup_path: [ "codes", "ccg" ],
      table_match_field: "CCG17CD",
      get_details_url: data_dir + '/details/{service_name_LOWER}-{Service ID_LOWER}.md',
      info_pairs: [
        {
          key: 'CCG17CDH',
          label: 'CCG17CDH'
        },
        {
          key: 'CCG17NM',
          label: 'CCG17NM'
        }
      ]
    }, 
    {
      name: "WCS",
      table: data_dir + "/service-wcs-ccg.csv",
      postcodes_lookup_path: [ "codes", "ccg" ],
      table_match_field: "CCG17CD",
      get_details_url: data_dir + '/details/{service_name_LOWER}-{Service ID_LOWER}.md',
      info_pairs: [
        {
          key: 'Service ID',
          label: 'Service ID'
        },
        {
          key: 'CCG17CD',
          label: 'CCG17CD'
        },
        {
          key: 'CCG17CDH',
          label: 'CCG17CDH'
        },
        {
          key: 'CCG17NM',
          label: 'CCG17NM'
        }
      ]
    },     
  ],
  get_postcode_url: '//api.postcodes.io/postcodes/{postcode}'
}
