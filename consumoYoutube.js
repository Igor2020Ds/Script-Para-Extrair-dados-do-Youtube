let pararRolagem = false; // Variável de controle

// Evento para parar quando pressionar "P"
document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "p") {
        pararRolagem = true;
        console.log("🛑 Rolagem interrompida! Coletando os vídeos carregados...");
    }
});

async function rolarEColetar() {
    let alturaAnterior = 0;
    let tempoInicio = performance.now();
    console.log("⏳ Iniciando rolagem... Pressione 'P' para parar.");

    while (!pararRolagem && document.documentElement.scrollHeight !== alturaAnterior) {
        alturaAnterior = document.documentElement.scrollHeight;
        window.scrollTo(0, alturaAnterior);
        console.log("🔄 Rolando mais...");

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    let tempoFim = performance.now();
    let tempoTotal = ((tempoFim - tempoInicio) / 1000).toFixed(2);
    console.log(`✅ Todos os vídeos carregados em ${tempoTotal} segundos!`);

    let dados = window.ytInitialData.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content
        .richGridRenderer.contents.filter(item => item.richItemRenderer)
        .map(item => {
            let video = item.richItemRenderer.content.videoRenderer;
            let titulo = video.title.runs[0].text;
            let visualizacoes = video.viewCountText?.simpleText.replace(/[^\d]/g, "") || "0";
            let publicado = video.publishedTimeText?.simpleText || "N/A";
            return [titulo, visualizacoes, publicado];
        });

    console.table(dados);
    console.log(`📌 Total de vídeos coletados: ${dados.length}`);
    console.log(`⏰ Tempo total de carregamento: ${tempoTotal} segundos.`);

    baixarExcel(dados);
}

// Função para criar e baixar o Excel sem biblioteca externa
function baixarExcel(dados) {
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF" + 
        "Título,Visualizações,Publicado há\n" + 
        dados.map(e => e.join(",")).join("\n");

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "videos_coletados.csv");
    document.body.appendChild(link);
    link.click();
    console.log("📂 Arquivo CSV gerado e baixado!");
}

// Executa a função
rolarEColetar();
