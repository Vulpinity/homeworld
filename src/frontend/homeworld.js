const {addHandler} = require('skid/lib/event');
const {PieAvatar} = require('skid/lib/scene/pie-avatar');

addHandler('load_done', (state) => {
    const wurld = new PieAvatar(state.scene.camera);
    wurld.layer = 0;
    wurld.fillStyle = '#040';
    wurld.x.setTo(3);
    wurld.y.setTo(-4);
    wurld.w.setTo(3);
    wurld.h.setTo(3);
    wurld.breadth.setTo(1);
});
