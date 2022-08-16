import { typeFromString } from '@/utils/common';
import { pascalCase, snakeCaseWithoutDot } from '@/utils/string';
import { TypeEnum } from '../configs/constant.config';

function typeString({ input }) {
  if (input.type === TypeEnum.CHAR) return 'char';
  if (input.type === TypeEnum.INTEGER) return 'int';
  if (input.type === TypeEnum.STRING) return 'string';

  const parseTypeResult = typeFromString(input.type);

  if (parseTypeResult) {
    if (parseTypeResult.type === TypeEnum.OBJECT) {
      return pascalCase(parseTypeResult.structName);
    }
    if (parseTypeResult.type === TypeEnum.ARRAY) {
      return `vector<${typeString({ input: parseTypeResult.encapsulated })}>`;
    }
  }
}

export function genCppPlaceholder({
  output,
  inputs = [],
  functionName = 'solution',
}) {
  const outputType = { input: { type: output } };
  const args = inputs
    .map((input) => {
      const parseTypeResult = typeFromString(input.type);

      if (
        [TypeEnum.STRING, TypeEnum.OBJECT, TypeEnum.ARRAY].includes(
          parseTypeResult.type
        )
      ) {
        return `${typeString({ input })}& ${snakeCaseWithoutDot(input.name)}`;
      }
      return `${typeString({ input })} ${snakeCaseWithoutDot(input.name)}`;
    })
    .join(', ');

  return `${typeString(outputType)} ${functionName} (${args}){\n\t\n}`;
}
