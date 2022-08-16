import { parseType, typeFromString } from '@/utils/common';
import { pascalCase, snakeCaseWithoutDot } from '@/utils/string';
import { TypeEnum } from '../configs/constant.config';

const INDENTATION = '';

function typeString({ input }) {
  if (input.type === TypeEnum.CHAR) return 'str';
  if (input.type === TypeEnum.STRING) return 'str';
  if (input.type === TypeEnum.INTEGER) return 'int';

  const parseTypeResult = typeFromString(input.type);

  if (parseTypeResult) {
    if (parseTypeResult.type === TypeEnum.OBJECT) {
      return pascalCase(parseTypeResult.structName);
    }
    if (parseTypeResult.type === TypeEnum.ARRAY) {
      //   const encapsulated = typeFromString(parseTypeResult.encapsulated);
      return `List[${typeString({ input: parseTypeResult.encapsulated })}]`;
    }
  }
}

export function genPythonPlaceholder({
  output,
  inputs = [],
  functionName = 'solution',
}) {
  const outputType = typeString({ input: { type: output } });
  const lines = [INDENTATION + '"""'];

  inputs.forEach((arg) => {
    lines.push(
      `${INDENTATION}@input ${snakeCaseWithoutDot(arg.name)}: ${typeString({
        input: arg,
      })}`
    );
  });
  lines.push(`${INDENTATION}@return ${outputType}`);
  lines.push(INDENTATION + '"""');

  const args = inputs
    .map((input) => {
      return `${snakeCaseWithoutDot(input.name)}: ${typeString({
        input: input,
      })}`;
    })
    .join(', ');

  lines.push(`def ${functionName} (${args})):\n\n\tpass`);

  return lines.join('\n');
}
