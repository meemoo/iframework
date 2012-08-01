$(function(){

  var template = 
    '<div class="edges">'+
      '<svg id="edgesSvg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"></svg>'+
    '</div>'+
    '<div class="nodes" />';

  Iframework.GraphView = Backbone.View.extend({
    tagName: "div",
    className: "graph",
    template: _.template(template),
    events: {
      "click": "click",
      "drop":  "drop"
    },
    initialize: function () {
      this.render();
      Iframework.$el.prepend(this.el);

      this.model.get("nodes").each(this.addNode);

      // Drag helper from module library
      this.$el.droppable({ 
        accept: ".addnode" 
      });

      this.resizeEdgeSVG();
    },
    render: function () {
      this.$el.html(this.template(this.model.toJSON()));
      return this;
    },
    click: function (event) {
      // Hide dis/connection boxes
      $(".edge-edit").remove();
      Iframework.selectedPort = null;
      
      // Unactivate modules
      $("div.module").removeClass("active");
    },
    drop: function (event, ui) {
      var module = ui.draggable.data("module");
      var x = Math.round(this.$el.scrollLeft() + ui.offset.left + 10);
      var y = Math.round(this.$el.scrollTop() + ui.offset.top + 35);
      module.view.dragAddNode({x:x,y:y});
    },
    addNode: function (node) {
      this.$(".nodes").append( node.initializeView().el );
      // Render the native view
      if (!!node.lazyLoadType) {
        node.view.initializeNative();
      }
    },
    addEdge: function (edge) {
      edge.initializeView();

      if (!!edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (!!edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
    },
    removeNode: function (node) {
      if (node.view) {
        node.view.$el.remove();
      }
    },
    removeEdge: function (edge) {
      if (edge.Source && edge.Source.view) {
        edge.Source.view.resetRelatedEdges();
      }
      if (edge.Target && edge.Target.view) {
        edge.Target.view.resetRelatedEdges();
      }
      if (edge.view) {
        edge.view.remove();
      }
    },
    resizeEdgeSVG: function () {
      var width = 0;
      var height = 0;
      this.model.get('nodes').each(function(node){
        var thisRight = node.get('x') + node.get('w');
        if ( thisRight > width ) {
          width = thisRight;
        }
        var thisBottom = node.get('y') + node.get('h');
        if ( thisBottom > height ) {
          height = thisBottom;
        }
      }, this);
      width += 150;
      height += 50;
      this.$('#edgesSvg').css({
        "width": width,
        "height": height
      });
    }
    
  });

});
