//!native
//!optimize 2
function CharAt(value: string, index: number){
  ++index;
  return value.sub(index, index);
}

export = CharAt;