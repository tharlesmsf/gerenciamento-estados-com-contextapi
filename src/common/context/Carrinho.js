import { createContext, useContext, useState, useEffect } from "react";
import { usePagamentoContext } from "./Pagamento";
import { UsuarioContext } from "./Usuario";

//O parametro passado para o createContext é um valor default
//quando não é passado pa prop value no provider
//então se não existir um value no provider o falor default vai ser usado
export const CarrinhoContext = createContext();

CarrinhoContext.displayName = "Carrinho";

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeProdutos, setQuantidadeProdutos] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);

  return (
    <CarrinhoContext.Provider 
      value={{
        carrinho,
        setCarrinho,
        quantidadeProdutos,
        setQuantidadeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    setValorTotalCarrinho    
  } = useContext(CarrinhoContext);

  const {formaPagamento} = usePagamentoContext();

  const {setSaldo} = useContext(UsuarioContext);

  const mudarQuantidade = (id, quantidade) => {
    return carrinho.map(itemDoCarrinho => {
      if(itemDoCarrinho.id === id) itemDoCarrinho.quantidade += quantidade;
      return itemDoCarrinho;
    })     
  };

  const adicionarProduto = (novoProduto) => {
    //O some() executa a função uma vez para cada elemento do array e retorna true ou false
    //O some() não executa a função para elementos de array vazio
    //O some() não altera a matriz original.
    //O some() retorna true se algum dos elementos do array passar no teste, 
    //caso contrário retorna false.
    const temOProduto = carrinho.some(itemDoCarrinho => itemDoCarrinho.id === novoProduto.id);
    if(!temOProduto){
      novoProduto.quantidade = 1;
      return setCarrinho(carrinhoAnterior => [...carrinhoAnterior, novoProduto])
    }
    setCarrinho(mudarQuantidade(novoProduto.id, 1))
  };

  const removerProduto = (id) => {
    //O find() retorna o valor do primeiro elemento que passa em um teste.
    //O find() retorna undefinedse nenhum elemento for encontrado.
    //O find() não executa a função para elementos vazios.
    //O find() não altera a matriz original.
     const produto = carrinho.find(itemDoCarrinho => itemDoCarrinho.id === id);
     const ehOUltimo = produto.quantidade === 1;

     if(ehOUltimo) {
       //O filter() cria um novo array preenchido com elementos que passam em um teste fornecido por uma função.
       //O filter() não executa a função para elementos vazios.
       //O filter() não altera a matriz original.
       //Se nenhum elemento passar no teste, ele retornará um array vazio.
       return setCarrinho(carrinhoAnterior => carrinhoAnterior.filter(itemDoCarrinho => itemDoCarrinho.id !== id))
     }
     setCarrinho(mudarQuantidade(id, -1))      
  };

  function efetuarCompra(){
    setCarrinho([]);
    setSaldo(saldoAtual => saldoAtual - valorTotalCarrinho)
  }

  //O use useEffect() espera 2 paramentros, uma função, que estamos passando como arrow function
  //e o que vamos "escutar" dentro de um array, aqui será o carrinho
  useEffect(() => {
    //O reduce() executa uma função redutora para o elemento array.
    //O reduce() retorna um único valor: o resultado acumulado da função.
    //O reduce() não executa a função para elementos de array vazios.
    //O reduce() não altera a matriz original.
    //Passa por todos os itens do array e coloca em uma só variavel o valor final
    //Espera 2 parametros, o primeiro é uma função e o segundo é o valor inicial
    //dentro da função pode ser passado como parametro 4 props:
    //contado que será usado para acumular o resultado e é o valor inicial
    //caso o valor incial não seja passado, o primeiro elemento do array original assume
    //o valor atual,
    //o index atual do valor atual
    //e o array original
    const {novoTotal, novaQuantidade} = carrinho.reduce(
      (contador, produto) => ({
        novaQuantidade: contador.novaQuantidade + produto.quantidade,
        novoTotal: contador.novoTotal + (produto.valor * produto.quantidade)
      }), {
        novaQuantidade: 0,
        novoTotal: 0
      });
    setQuantidadeProdutos(novaQuantidade);
    setValorTotalCarrinho(novoTotal * formaPagamento.juros)
  }, [carrinho, setQuantidadeProdutos, setValorTotalCarrinho, formaPagamento]);

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeProdutos,
    setQuantidadeProdutos,
    valorTotalCarrinho,
    efetuarCompra
  }
}