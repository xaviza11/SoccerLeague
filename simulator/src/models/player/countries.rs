use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Debug, Clone, PartialEq, Eq, Hash)]
#[serde(rename_all = "PascalCase")]
pub enum Country {
    Spain,
    Mexico,
    Argentina,
    Colombia,
    Peru,
    Venezuela,
    Chile,
    Ecuador,
    Guatemala,
    Cuba,
    Bolivia,
    #[serde(rename = "Dominican Republic")]
    DominicanRepublic,
    Honduras,
    Paraguay,
    #[serde(rename = "El Salvador")]
    ElSalvador,
    Nicaragua,
    #[serde(rename = "Costa Rica")]
    CostaRica,
    Uruguay,
    Panama,
    #[serde(rename = "Puerto Rico")]
    PuertoRico,
    Brazil,
    Portugal,
    Croatia,
    Germany,
    Denmark,
    Sweden,
    Norway,
    Finland,
    Netherlands,
    England,
    Romania,
    Hungary,
    Italy,
    Belgium,
    Switzerland,
    Austria,
    Poland,
    #[serde(rename = "Czech Republic")]
    CzechRepublic,
    Slovakia,
    Slovenia,
    Serbia,
    French
}
