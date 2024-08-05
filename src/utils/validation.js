export function validateCPF(cpf) {

    cpf = cpf.replace(/\D/g, '');
  
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
      return false;
    }
  
    let soma = 0;
    let resto;
  
    for (let i = 1; i <= 9; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    if (resto !== parseInt(cpf.charAt(9))) {
      return false;
    }
  
    soma = 0;
  
    for (let i = 1; i <= 10; i++) {
      soma += parseInt(cpf.charAt(i - 1)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) {
      resto = 0;
    }
    return resto === parseInt(cpf.charAt(10));
  }
  