const nlp = require('compromise');

const extractNamedEntities = (text) => {
  const doc = nlp(text);

  const entities = [];

  // Extract people, organizations, dates, and locations
  doc.people().forEach((person) => entities.push({ text: person.text(), label: 'PERSON' }));
  doc.organizations().forEach((org) => entities.push({ text: org.text(), label: 'ORG' }));
  doc.places().forEach((place) => entities.push({ text: place.text(), label: 'GPE' }));
//   doc.dates().forEach((date) => entities.push({ text: date.text(), label: 'DATE' }));

  return entities;
};

module.exports = { extractNamedEntities };
