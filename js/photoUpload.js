Ext.define('photoUpload', {

    extend: 'Ext.form.Panel',
    alias:'widget.photoupload',

    border: true,
    layout: 'border',
    bodyPadding: 5,

    constructor: function(c) {
        var me = this;

        var store = Ext.create('jsonDataStore', {
            fields: ['id', 'no', 'nama'],
            url: 'store/dataStore.php',
            autoLoad: true,
            listeners: {
            load: function(e, records, successful, eOpts) {
                    if(successful) {
                        if(store.getCount()>0) {
                            me.down('grid').getView().getSelectionModel().select(store.getAt(store.getCount()-1));
                        }
                    }
                }
            }
        });

        var _uploadPhoto = function(f) {

            me.getForm().waitMsgTarget = me.getEl();
            me.getForm().submit({
                method:'POST',
                url: 'store/uploadPhoto.php',
                waitMsg: 'Upload...',
                success: function(f, a) {
                    store.loadPage(1);
                },
                failure:function(f, a) {
                    me.getEl().mask();
                    var msg = Ext.MessageBox.show({
                        title: 'Kesalahan',
                        msg: a.result?a.result.message:'Oops, respon server error.',
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR,
                        modal: false,
                        fn: function() {
                            me.getEl().unmask();
                        }
                    });
                    msg.alignTo(me.el, 'c-c');
                }
            });
        };

        var  _showPhoto = function(record) {

            var panel = me.down('#photo');
            var chars = "0123456789";
            var string_length = 3;
            var randomstring = '';
            for (var i=0; i<string_length; i++) {
                var rnum = Math.floor(Math.random() * chars.length);
                randomstring += chars.substring(rnum,rnum+1);
            }
            var url = 'store/showPhoto.php?' + randomstring + '&';

            var w = panel.getWidth();
            var h = panel.getHeight();


            panel.body.hide();
            panel.tpl = new Ext.Template(
                    (!Ext.isIE6? '<img width="' + w + '" height="' + h + '" src="'+ url + 'id={id}" />' :
                    '<div style="width:' + w + ';height:' + h + ';filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'' + url + 'id={id}\')"></div>')
            );

            panel.tpl.overwrite(panel.body, record);
            panel.body.slideIn('t', {
                duration: 250
            });

        };

        Ext.apply(c, {
            items:[{
                xtype: 'grid',
                columnLines: true,
                region: 'center',
                flex:1,
                store: store,
                columns: [
                    {text: 'No.', dataIndex: 'no', align: 'center', width: 50},
                    {text: 'Nama', dataIndex: 'nama', align: 'left', flex: 1}
                ],
                tbar: [{
                    xtype: 'filefield',
                    name: 'filename',
                    buttonOnly: true,
                    buttonText: 'Upload',
                    buttonConfig: {
                         iconCls: 'upload'
                    },
                    listeners: {
                        change: _uploadPhoto,
                        scope: me
                    }
                }, '-', Ext.create('Ext.ux.form.SearchField', {
                    store: store,
                    flex: 1
                })],
                bbar: [Ext.create('Ext.PagingToolbar', {
                    flex: 1,
                    store: store,
                    displayInfo: true,
                    displayMsg: 'Data {0} - {1} dari {2} data',
                    emptyMsg: 'Tidak ada data untuk ditampilkan.'
                })],
                listeners: {
                    selectionchange: function(view, selections) {
                        if(selections[0])
                            _showPhoto(selections[0].data);
                    }
                },
                split: true
            }, {
                xtype: 'panel',
                title: 'Photo',
                region: 'east',
                split: true,
                layout: 'fit',
                items:[{
                    xtype: 'panel',
                    itemId: 'photo',
                    border: false,
                    listeners: {
                        resize: function() {
                            var record = me.down('grid').getView().getSelectionModel().getSelection()[0];
                            if(record) _showPhoto(record.data);
                        }
                    }
                }],
                flex: 0.9
            }]
        });

        this.callParent(arguments);
     }
});