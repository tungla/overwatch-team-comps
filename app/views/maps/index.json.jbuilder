json.maps @maps do |map|
  json.name map.name
  json.type map.map_type
  json.segments map.segments.pluck(:name)
end
