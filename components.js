/**
* @jsx React.DOM
*/

vent = _.extend(Backbone.Events);

var FakeReportModel = Backbone.Model.extend({

	initialize: function () {
		var that = this;
		setInterval(function () {
			that.set({
				group_stats: {
					incoming_messages: {
						count: parseInt(Math.random() * (100 - 1) + 1),
						percent_change: parseInt(Math.random() * (100 - 1) + 1)
					},
					sent_messages: {
						count: parseInt(Math.random() * (100 - 1) + 1),
						percent_change: parseInt(Math.random() * (100 - 1) + 1)
					},
					new_twitter_followers: {
						count: parseInt(Math.random() * (100 - 1) + 1),
						percent_change: parseInt(Math.random() * (100 - 1) + 1)
					},
					facebook_fan_adds: {
						count: parseInt(Math.random() * (100 - 1) + 1),
						percent_change: parseInt(Math.random() * (100 - 1) + 1)
					}
				}
			});
		}, 1000);
	},

	keyToLang: {
		'incoming_messages': 'Incoming Messages',
		'sent_messages': 'Sent Messages',
		'new_twitter_followers': 'New Twitter Followers',
		'facebook_fan_adds': 'New Facebook Fans'
	},

	toPillow: function () {
		var group_stats = this.get('group_stats'),
			model = this,
			stats = [];

		if (group_stats) {
			_.each(model.keyToLang, function (v, k){
				if (group_stats[k]){ 
					stats.push({
						titleName: v,
						count: group_stats[k].count || '--',
						percentage: group_stats[k].percent_change || '--',
						positive: group_stats[k] > 0
					});
				}
			});
			
			return {statsRows: stats};
		}
	}
});

var StatRow = React.createClass({
	getInitialState: function () {
		return {
			count: '--',
			percentage: '--'
		};
	},

	render: function () {
		return (
			<div className="StatRow">
				{this.props.titleName}
				{this.props.percentage + '%'}
				{this.props.count}
			</div>
		);
	}
});

var Pillow = React.createClass({
	getInitialState: function () {
		return {data: {}};
	},

	applyState: function (model) {
		this.setState(this.props.model.toPillow());
	},

	componentWillMount: function () {
		this.props.model.on('change', this.applyState);
	},

	render: function () {
		var statsRows = this.state.statsRows,
			stats = statsRows && statsRows.map(function (data) {
				return <StatRow titleName={data.titleName} count={data.count} percentage={data.percentage} />;
			});

		return (
			<div className="Pillow">
				{stats}
			</div>
		);
	}
});

React.renderComponent(
	<Pillow model={new FakeReportModel()} />,
	document.body
);

$(document).ready(function () {
	vent.trigger('change');
});


