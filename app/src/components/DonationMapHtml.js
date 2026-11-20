export function createDonationMapHtml(hemocentros) {
    const pontos = hemocentros
        .filter(({ latitude, longitude }) => (Number.isFinite(latitude)
        && Number.isFinite(longitude)
        && latitude >= -90
        && latitude <= 90
        && longitude >= -180
        && longitude <= 180))
        .map(({ id, nome, endereco, latitude, longitude }) => ({
        id,
        nome,
        endereco,
        latitude,
        longitude,
    }));
    // Evita que dados vindos da API encerrem a tag script do documento embutido.
    const dados = JSON.stringify(pontos).replace(/</g, '\\u003c');
    return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <link rel="stylesheet" href="https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.css" />
    <style>
      html, body, #mapa { height: 100%; width: 100%; margin: 0; }
      body { background: #fff0ee; font-family: Arial, sans-serif; }
      .maplibregl-popup-content { margin: 0; min-width: 180px; padding: 12px 14px; }
      .tipo { color: #756868; font-size: 11px; font-weight: 700; letter-spacing: .04em; margin-bottom: 4px; text-transform: uppercase; }
      .nome { color: #890b0b; font-size: 14px; font-weight: 800; margin-bottom: 5px; }
      .endereco { color: #756868; font-size: 12px; line-height: 17px; }
      #erro { align-items: center; color: #890b0b; display: none; height: 100%; justify-content: center; padding: 24px; text-align: center; }
    </style>
  </head>
  <body>
    <div id="mapa"></div>
    <div id="erro">Não foi possível carregar o mapa. Verifique sua conexão com a internet.</div>
    <script src="https://unpkg.com/maplibre-gl@5.9.0/dist/maplibre-gl.js"></script>
    <script>
      const hemocentros = ${dados};
      const mostrarErro = () => {
        document.getElementById('mapa').style.display = 'none';
        document.getElementById('erro').style.display = 'flex';
      };

      try {
        if (typeof maplibregl === 'undefined') throw new Error('MapLibre indisponível');
        const mapa = new maplibregl.Map({
          container: 'mapa',
          style: 'https://tiles.openfreemap.org/styles/liberty',
          center: [-51.9253, -14.235],
          zoom: 4,
          maxZoom: 18,
        });
        mapa.addControl(new maplibregl.NavigationControl(), 'top-left');

        mapa.on('load', () => {
          const limites = new maplibregl.LngLatBounds();
          let possuiPontos = false;

          hemocentros.forEach((hemocentro) => {
            const posicao = [hemocentro.longitude, hemocentro.latitude];
            limites.extend(posicao);
            possuiPontos = true;

            const conteudo = document.createElement('div');
            const tipo = document.createElement('div');
            const nome = document.createElement('div');
            const endereco = document.createElement('div');
            tipo.className = 'tipo';
            nome.className = 'nome';
            endereco.className = 'endereco';
            tipo.textContent = 'Local de doação';
            nome.textContent = hemocentro.nome;
            endereco.textContent = hemocentro.endereco;
            conteudo.append(tipo, nome, endereco);

            new maplibregl.Marker({ color: '#ef4444' })
              .setLngLat(posicao)
              .setPopup(new maplibregl.Popup({ offset: 25 }).setDOMContent(conteudo))
              .addTo(mapa);
          });

          if (possuiPontos) mapa.fitBounds(limites, { padding: 36, maxZoom: 14, duration: 0 });
        });
      } catch (erro) {
        mostrarErro();
      }
    </script>
  </body>
</html>`;
}
//# sourceMappingURL=DonationMapHtml.js.map