import { sortInputDesc, typeFromString } from '@/utils/common';
import { TypeEnum } from '../configs/constant.config';

function typeString({ input, structs }) {
  if (input.type === 'INTEGER') return 'number';
  if (input.type === 'CHAR') return 'string';
  if (input.type === 'STRING') return 'string';

  const parseTypeResult = typeFromString(input.type);

  if (parseTypeResult) {
    if (parseTypeResult.type === TypeEnum.OBJECT) {
      const struct = structs.find(
        (struct) => struct.name === parseTypeResult.structName
      );

      const typeStruct = struct.fields.map((field) => {
        return `"${field.name}": ${typeString({
          input: field,
          structs,
        })}`;
      });
      return `{${typeStruct.join(', ')}}`;
    }
    if (parseTypeResult.type === TypeEnum.ARRAY) {
      return `Array.<${typeString({
        input: parseTypeResult.encapsulated,
        structs,
      })}>`;
    }
  }
}

export function getJavascriptPlaceholder({
  output,
  inputs = [],
  structs = [],
  functionName = '',
}) {
  const lines = ['/**'];

  [...inputs].forEach((input) => {
    lines.push(
      ` * @param {${typeString({ input, structs })}} ${input.name} ${
        input.comment || ''
      }`
    );
  });
  lines.push(
    ` * @return {${typeString({ input: { type: output || 'void' }, structs })}}`
  );
  lines.push(' */');
  lines.push(
    `function ${functionName.trim() || 'solution'} (${inputs
      .map((i) => i.name)
      .join(', ')}){\n\t\n}`
  );
  return lines.join('\n');
}
