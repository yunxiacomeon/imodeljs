# Content-related Rules

There are 2 primary concepts for creating content: rules and specifications.

## Rules

Define *if* specific set of specifications should be used to create content for specific instances:
- [ContentRule](./Content/ContentRule.md)

## Specifications

Define *what content* is returned. There are 3 types of specifications:
- [SelectedNodeInstances](./Content/SelectedNodeInstances.md)
- [ContentInstancesOfSpecificClasses](./Content/ContentInstancesOfSpecificClasses.md)
- [ContentRelatedInstances](./Content/ContentRelatedInstances.md)

Multiple specifications can contribute to the same content rule if:
- There are multiple of them specified in a single rule
- There are multiple rules whose condition returns `true`

## Modifiers

Content modifiers allow modifying content by hiding or showing properties, including additional ones
or specifying custom editors.
- [CalculatedProperties](./Content/CalculatedPropertiesSpecification.md)
- [PropertiesDisplay](./Content/PropertiesDisplaySpecification.md)
- [PropertyEditors](./Content/PropertyEditorsSpecification.md)
- [RelatedProperties](./Content/RelatedPropertiesSpecification.md)
