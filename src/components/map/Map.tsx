import { useState, useEffect, useRef } from 'react';

import AMapLoader from '@amap/amap-jsapi-loader';
import '@amap/amap-jsapi-types';

import styles from './index.module.scss';
import { AMAP_CODE, AMAP_KEY } from '@/constants';
import heartGeo from '@/data/heart.json';
import loveGeo from '@/data/love.json';
import youGeo from '@/data/you.json';
import breathYellow from '@/assets/breath-yellow.png';
import breathRed from '@/assets/breath-red.png';
import breathWhite from '@/assets/breath-white.png';
import { createMap, createLines, createPoints, dataToLineFeatureCollection, dataToPointFeatureCollection, pointFeatureCollectionToData } from './utils';

const loveData = pointFeatureCollectionToData(loveGeo);
const lovePointData = dataToPointFeatureCollection(loveData);
const loveLineData = dataToLineFeatureCollection(loveData);

const heartData = pointFeatureCollectionToData(heartGeo);
const heartPointData = dataToPointFeatureCollection(heartData);
const heartLineData = dataToLineFeatureCollection(heartData);

const youData = pointFeatureCollectionToData(youGeo);
const youPointData = dataToPointFeatureCollection(youData);
const youLineData = dataToLineFeatureCollection(youData);

interface MapProps {
  onPointClick: (point: any) => void;
}
function Map(props: MapProps) {
  const [mapInstance, setMapInstance] = useState<AMap.Map>();
  const mapDOM = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    window._AMapSecurityConfig = {
      securityJsCode: AMAP_CODE
    };

    AMapLoader.load({
      key: AMAP_KEY,
      version: '2.0',
      plugins: ['AMap.Geocoder'],
      Loca: {
        version: '2.0'
      }
    }).then((AMap) => {
      const calcZoom = () => {
        const w = document.body.clientWidth;
        if (w > 710) return 5.5;
        if (w < 710 && w > 510) return 5;
        return 4.5;
      };

      const map = createMap(mapDOM.current!, AMap, {
        zoom: calcZoom(),
        center: [105.780608, 32.71143047],
        showLabel: false
      });
      setMapInstance(map);

      // @ts-ignore
      const loca = new Loca.Container({ map });

      createPoints(loca, lovePointData, { texture: breathRed });
      createLines(loca, loveLineData);

      createPoints(loca, youPointData, { texture: breathWhite });
      createLines(loca, youLineData);

      const scatter = createPoints(loca, heartPointData, { texture: breathYellow });
      createLines(loca, heartLineData);

      loca.animate.start();

      // @ts-ignore
      map.on('click', function (e) {
        const feat = scatter.queryFeature(e.pixel.toArray());

        if (feat) {
          const geocoder = new AMap.Geocoder();

          geocoder.getAddress(feat.properties.lnglat, (status: any, result: any) => {
            if (status === 'complete' && result.regeocode) {
              const { formattedAddress, addressComponent } = result.regeocode;
              const { province, city } = addressComponent;

              props.onPointClick({ ...feat.properties, city, province, address: formattedAddress });
            } else {
              console.log('根据经纬度查询地址失败');
            }
          });
        }
      });
    });

    return () => {
      if (mapInstance) mapInstance.destroy();
    };
  }, []);

  return <div id='map-container' ref={mapDOM} className={styles.map}></div>;
}

export default Map;
