import classNames from 'classnames';
import { useState, forwardRef, useImperativeHandle, FC, Ref, ForwardRefRenderFunction } from 'react';
import { Modal } from 'antd';

import styles from './index.module.scss';

interface InfoProps {
  data: { [key: string]: any };
}

export interface InfoRef {
  setVisible: Ref<any>;
}

const Info: ForwardRefRenderFunction<InfoRef, InfoProps> = (props, ref) => {
  const data = props.data;
  const [visible, setVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    setVisible
  }));

  const footerCom = <footer className={classNames(styles.footer)}>{data.address}</footer>;

  const infoCom = (
    <ul className={styles.info}>
      <li>
        这是我们第<b>{data.index}</b>次一起旅游
      </li>
      <li>
        在这里我们一共去了<b>{data.scenicCount}</b>个景点
      </li>
      <li>
        在这里我们一共拍了<b>{data.photoCount}</b>张照片
      </li>
      <li>
        在这里我们一共消费<b>{data.consume}</b>元
      </li>
    </ul>
  );

  return (
    <Modal title={data.province + data.city} footer={[footerCom]} open={visible} onCancel={() => setVisible(false)}>
      {/* <p>备注：{JSON.stringify(data.lnglat)}</p> */}

      {infoCom}
    </Modal>
  );
};

export default forwardRef(Info);
