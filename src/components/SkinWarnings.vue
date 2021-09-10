<template>
	<warning-box class="warningbox">
		<span v-if="beta">Warning: This skin is marked as beta.</span>
		<span v-if="experimental">
			Warning: This skin has been marked as experimental.
		</span>
		<span v-if="hasDependencies">
			Warning: This skin requires additional setup.
		</span>
		<span v-if="mightBreak">
			Warning: This skin has been flagged to indicate this it may
			break in future MediaWiki versions
			without prompt action.
		</span>
		<span v-if="!compatible">
			Warning: This skin does not work with the latest MediaWiki release.
		</span>
		<span v-if="unmaintained">
			Warning: This skin is not maintained.
			It is likely incompatible with the current MediaWiki branch.<br><br>
			Please <a :href="mwUrl">review the skin's page</a>
			on MediaWiki.org for the problem with this skin which will be described
			in the status field:
			<pre>|status      = unmaintained &lt;!-- explanation --&gt; </pre>

			If you are the skin author, please address the problem described.
			If you are capable, you may want to fork this skin, and
			become it's maintainer.
			If you do this, please update the repository URL on
			<a :href="url">MediaWiki.org</a>.
		</span>
	</warning-box>
</template>

<script>
import WarningBox from '../components/WarningBox.vue';

export default {
	name: 'SkinWarnings',
	components: {
		WarningBox
	},
	props: {
		beta: {
			type: Boolean,
			required: true
		},
		experimental: {
			type: Boolean,
			required: true
		},
		hasDependencies: {
			type: Boolean,
			required: true
		},
		mightBreak: {
			type: Boolean,
			required: true
		},
		compatible: {
			type: Boolean,
			required: true
		},
		unmaintained: {
			type: Boolean,
			required: true
		},
		url: {
			type: String,
			required: true
		}
	}
};
</script>