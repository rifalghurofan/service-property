Table properties {
  id varchar [PK]
  address Address
  brochure varchar
  categories array
  linked_tender boolean
  creator varchar
  description text
  developer varchar
  fee int
  image_map varchar
  images array
  index_priority int
  is_secondary boolean
  is_sold boolean
  keywords array
  listing_id varchar
  maps varchar
  name varchar
  near_facilities_id varchar
  panoramas varchar[]
  payments varchar[]
  property_type enum
  redirect_tender boolean
  rental_price int
  selling_price int
  siteplan_id varchar
  sketch varchar
  status enum
  transaction enum
  spesification_id varchar
  updated_at timestamp
  type_houses TypeHouses[]
}

Table siteplans {
  id varchar [PK]
  property_id varchar
  scale float
  font_size float
  image varchar
  background varchar
  x_coordinate float
  y_coordinate float
  z_coordinate float
}

Table kavlings   {
  id varchar [PK]
  property_id varchar
  block varchar
  certificate varchar
  certificates varchar[]
  cluster varchar
  images varchar[]
  interface_id varchar
  type_house_id varchar
}

Table interface {
  id varchar [PK]
  color varchar
  height float
  width float
  offsets varchar[]
  shape varchar
  position_x float
  position_y float
}

Table type_houses {
  id varchar [PK]
  property_id varchar
  booking_fee int
  name varchar
  business varchar
  color varchar
  description text
  imgaes varchar[]
  other_business varchar
  price int
  property_type enum()
  slot int
  unit_facilities array[]
  live_previews varchar[]
}

Table live_previews{
  id varchar [PK]
  name varchar
  url varchar
}

Ref: properties.siteplan_id - siteplans.property_id
Ref: properties.id < kavlings.property_id
Ref: properties.id < type_houses.property_id
Ref: properties.panoramas < live_previews.id
Ref: kavlings.interface_id - interface.id
Ref: kavlings.type_house_id > type_houses.id
Ref: live_previews.id < type_houses.live_previews