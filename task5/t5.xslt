<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" xmlns:math="http://exslt.org/math">

<xsl:template match="/">

<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="styles.css" rel="stylesheet" type="text/css" />
  <title>Task 5</title>
  <script src="https://cdn.plot.ly/plotly-2.6.3.min.js"></script>
</head>
  <body>
    <script>
      var data = [];
      var layout = {};
    </script>
    <div class="center">
      <h1>Показатели инвестиционной активности в городе Москве</h1>
    </div>
    <xsl:for-each select="catalog/array">
        <div class="center">
          <h2>
            <xsl:value-of select="NameInInformationSource" />
          </h2>
        </div>
        <script>
          data = [
            {
              x: [],
              y: [],
              type: 'bar'
            }
          ]
          layout = {
            title: '<xsl:value-of select="Name" />'
          }
        </script>
        <xsl:for-each select="IndexValues">
          <script>
            data[0].x.push(
              '<xsl:value-of select="Year" />' + '-' + '<xsl:value-of select="Quarter" />'.split(' ')[0]
            )
            data[0].y.push(
              <xsl:value-of select="Value" />
            )
          </script>
        </xsl:for-each>

        <xsl:variable name="divName">
          <xsl:text>graphic#</xsl:text>
          <xsl:value-of select="position()" />
        </xsl:variable>

        <div class="graphic">
          <xsl:attribute name="id">
            <xsl:value-of select="$divName" />
          </xsl:attribute>
        </div>

        <xsl:variable name="minValue" select="math:min(IndexValues/Value)" />
        <div class="minText">
          <h3>Минимальное значение: <xsl:value-of select="$minValue" /></h3>
          <h3>Год: <xsl:value-of select="IndexValues[Value=$minValue]/Year" /></h3>
          <h3>Квартал: <xsl:value-of select="substring-before(IndexValues[Value=$minValue]/Quarter, ' ')" /></h3>
        </div>

        <script>
          Plotly.newPlot('<xsl:value-of select="$divName" />', data, layout)
        </script>
    </xsl:for-each>
  </body>
</html>

</xsl:template>

<xsl:output method="xml" omit-xml-declaration="yes"/>
</xsl:stylesheet>
