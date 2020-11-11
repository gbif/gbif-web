function reducePerson(entity) {
  const name = entity?.labels?.en?.value || entity.labels.find(x => x.value).value;
  return {
    key: entity.id,
    name,
    raw: entity
  }
}

module.exports = {
  reducePerson
}